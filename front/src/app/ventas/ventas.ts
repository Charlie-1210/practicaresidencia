import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { type Venta, VentasApi } from './ventas-api';
import { type Persona, PersonasApi } from '../personas/personas-api';
import { type Producto, ProductosApi } from '../productos/productos-api';
import { obtenerMensajeError } from '../shared/mensaje-error';

// Un renglón del formulario de nueva venta
interface LineaVenta {
  productoId: number | null;
  cantidad: number;
}

const LINEA_VACIA: LineaVenta = { productoId: null, cantidad: 1 };

@Component({
  selector: 'app-ventas',
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
  ],
  templateUrl: './ventas.html',
  styleUrls: ['../shared/crud-page.css', './ventas.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ventas implements OnInit {
  private readonly ventasApi = inject(VentasApi);
  private readonly personasApi = inject(PersonasApi);
  private readonly productosApi = inject(ProductosApi);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  private nuevaVentaDialogRef: MatDialogRef<unknown> | null = null;

  readonly nuevaVentaDialog = viewChild.required<TemplateRef<unknown>>('nuevaVentaDialog');
  readonly detalleVentaDialog = viewChild.required<TemplateRef<unknown>>('detalleVentaDialog');

  readonly displayedColumns = ['id', 'fecha', 'persona', 'productos', 'total', 'acciones'];
  readonly detalleColumns = ['producto', 'cantidad', 'precio', 'subtotal'];

  // Listado de ventas
  readonly ventas = signal<Venta[]>([]);
  readonly cargando = signal(false);
  readonly errorCarga = signal('');
  readonly ventaSeleccionada = signal<Venta | null>(null);

  // Catálogos para el formulario de nueva venta
  readonly personas = signal<Persona[]>([]);
  readonly productos = signal<Producto[]>([]);
  readonly cargandoCatalogos = signal(false);

  // Formulario de nueva venta
  readonly personaId = signal<number | null>(null);
  readonly lineas = signal<LineaVenta[]>([{ ...LINEA_VACIA }]);
  readonly intentoGuardar = signal(false);
  readonly guardando = signal(false);
  readonly errorFormulario = signal('');

  // Total que se va mostrando mientras se arma la venta
  readonly totalVenta = computed(() =>
    this.lineas().reduce((total, linea) => total + this.subtotalDe(linea), 0),
  );

  // Errores del formulario (se muestran después de intentar guardar)
  readonly erroresVenta = computed(() => {
    const errores: string[] = [];
    if (this.personaId() === null) {
      errores.push('Selecciona la persona a la que se le vende.');
    }
    if (this.lineas().some((linea) => linea.productoId === null)) {
      errores.push('Selecciona el producto de cada renglón.');
    }
    if (this.lineas().some((linea) => !Number.isInteger(linea.cantidad) || linea.cantidad < 1)) {
      errores.push('La cantidad de cada producto debe ser un número entero mayor a 0.');
    }
    return errores;
  });

  ngOnInit(): void {
    void this.cargarVentas();
  }

  async abrirNuevaVenta(): Promise<void> {
    // Se reinicia el formulario
    this.personaId.set(null);
    this.lineas.set([{ ...LINEA_VACIA }]);
    this.intentoGuardar.set(false);
    this.errorFormulario.set('');

    this.nuevaVentaDialogRef = this.dialog.open(this.nuevaVentaDialog(), {
      autoFocus: false,
      maxWidth: '44rem',
      restoreFocus: true,
      width: 'calc(100vw - 2rem)',
    });
    this.nuevaVentaDialogRef.afterClosed().subscribe(() => {
      this.nuevaVentaDialogRef = null;
    });

    // Se cargan las personas y los productos para las listas desplegables
    this.cargandoCatalogos.set(true);
    try {
      const [personas, productos] = await Promise.all([
        firstValueFrom(this.personasApi.obtenerTodas()),
        firstValueFrom(this.productosApi.obtenerTodos()),
      ]);
      this.personas.set(personas);
      this.productos.set(productos);
    } catch (error: unknown) {
      this.errorFormulario.set(
        obtenerMensajeError(error, 'No fue posible cargar personas y productos.'),
      );
    } finally {
      this.cargandoCatalogos.set(false);
    }
  }

  cerrarNuevaVenta(): void {
    if (!this.guardando()) {
      this.nuevaVentaDialogRef?.close();
    }
  }

  agregarLinea(): void {
    this.lineas.update((lineas) => [...lineas, { ...LINEA_VACIA }]);
  }

  quitarLinea(indice: number): void {
    this.lineas.update((lineas) => lineas.filter((_, i) => i !== indice));
  }

  cambiarProducto(indice: number, productoId: number): void {
    this.actualizarLinea(indice, { productoId });
  }

  cambiarCantidad(indice: number, event: Event): void {
    const cantidad = (event.target as HTMLInputElement).valueAsNumber;
    this.actualizarLinea(indice, { cantidad: Number.isNaN(cantidad) ? 0 : cantidad });
  }

  // Precio x cantidad de un renglón (en centavos para no perder decimales)
  subtotalDe(linea: LineaVenta): number {
    const producto = this.productos().find((p) => p.id === linea.productoId);
    if (!producto || linea.cantidad < 1) {
      return 0;
    }
    return (Math.round(producto.precio * 100) * linea.cantidad) / 100;
  }

  precioDe(productoId: number | null): number | null {
    return this.productos().find((p) => p.id === productoId)?.precio ?? null;
  }

  async guardarVenta(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    this.intentoGuardar.set(true);
    this.errorFormulario.set('');

    const personaId = this.personaId();
    if (this.erroresVenta().length > 0 || personaId === null) {
      return;
    }

    this.guardando.set(true);
    try {
      const venta = await firstValueFrom(
        this.ventasApi.crear({
          personaId,
          detalles: this.lineas().map((linea) => ({
            productoId: linea.productoId as number,
            cantidad: linea.cantidad,
          })),
        }),
      );
      this.nuevaVentaDialogRef?.close();
      this.snackBar.open(`Venta #${venta.id} registrada correctamente.`, 'Cerrar', {
        duration: 4500,
      });
      await this.cargarVentas();
    } catch (error: unknown) {
      this.errorFormulario.set(obtenerMensajeError(error, 'No fue posible registrar la venta.'));
    } finally {
      this.guardando.set(false);
    }
  }

  verDetalle(venta: Venta): void {
    this.ventaSeleccionada.set(venta);
    this.dialog
      .open(this.detalleVentaDialog(), {
        autoFocus: false,
        maxWidth: '40rem',
        width: 'calc(100vw - 2rem)',
      })
      .afterClosed()
      .subscribe(() => this.ventaSeleccionada.set(null));
  }

  // Texto corto con los productos de la venta para la tabla
  resumenProductos(venta: Venta): string {
    return venta.detalles
      .map((detalle) => `${detalle.cantidad} × ${detalle.producto.nombre}`)
      .join(', ');
  }

  reintentar(): void {
    void this.cargarVentas();
  }

  private actualizarLinea(indice: number, cambios: Partial<LineaVenta>): void {
    this.lineas.update((lineas) =>
      lineas.map((linea, i) => (i === indice ? { ...linea, ...cambios } : linea)),
    );
  }

  private async cargarVentas(): Promise<void> {
    this.cargando.set(true);
    this.errorCarga.set('');
    try {
      this.ventas.set(await firstValueFrom(this.ventasApi.obtenerTodas()));
    } catch (error: unknown) {
      this.errorCarga.set(obtenerMensajeError(error, 'No fue posible cargar las ventas.'));
    } finally {
      this.cargando.set(false);
    }
  }
}
