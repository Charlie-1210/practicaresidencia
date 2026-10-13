import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { form, FormField, min, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { type Producto, ProductosApi } from './productos-api';
import { obtenerMensajeError } from '../shared/mensaje-error';

interface ProductoForm {
  nombre: string;
  descripcion: string;
  precio: number | null;
}

const PRODUCTO_VACIO: ProductoForm = { nombre: '', descripcion: '', precio: null };

@Component({
  selector: 'app-productos',
  imports: [
    CurrencyPipe,
    FormField,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
  ],
  templateUrl: './productos.html',
  styleUrl: '../shared/crud-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Productos implements OnInit {
  private readonly productosApi = inject(ProductosApi);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  private formDialogRef: MatDialogRef<unknown> | null = null;
  private deleteDialogRef: MatDialogRef<unknown> | null = null;

  readonly productoFormDialog = viewChild.required<TemplateRef<unknown>>('productoFormDialog');
  readonly eliminarProductoDialog =
    viewChild.required<TemplateRef<unknown>>('eliminarProductoDialog');

  readonly displayedColumns = ['id', 'nombre', 'descripcion', 'precio', 'acciones'];

  // Estado de la pantalla
  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly eliminando = signal(false);
  readonly errorCarga = signal('');
  readonly errorFormulario = signal('');
  readonly busquedaAplicada = signal('');

  // null = creando un producto nuevo; un número = editando ese producto
  readonly productoEditandoId = signal<number | null>(null);
  readonly productoAEliminar = signal<Producto | null>(null);

  // Formulario de búsqueda
  readonly filtrosModel = signal({ search: '' });
  readonly filtrosForm = form(this.filtrosModel);

  // Formulario de crear/editar (es el mismo para las dos cosas)
  readonly productoModel = signal<ProductoForm>({ ...PRODUCTO_VACIO });
  readonly productoForm = form(this.productoModel, (path) => {
    required(path.nombre, { message: 'Ingresa el nombre del producto.' });
    required(path.precio, { message: 'Ingresa el precio.' });
    min(path.precio, 0.01, { message: 'El precio debe ser mayor a 0.' });
  });

  ngOnInit(): void {
    void this.cargarProductos();
  }

  onFiltrosSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.busquedaAplicada.set(this.filtrosModel().search.trim());
    void this.cargarProductos();
  }

  limpiarBusqueda(): void {
    this.filtrosForm().reset({ search: '' });
    this.busquedaAplicada.set('');
    void this.cargarProductos();
  }

  abrirCrear(): void {
    this.productoEditandoId.set(null);
    this.productoForm().reset({ ...PRODUCTO_VACIO });
    this.abrirFormularioDialog();
  }

  abrirEditar(producto: Producto): void {
    this.productoEditandoId.set(producto.id);
    this.productoForm().reset({
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      precio: producto.precio,
    });
    this.abrirFormularioDialog();
  }

  cerrarModal(): void {
    if (!this.guardando()) {
      this.formDialogRef?.close();
    }
  }

  onGuardarSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.errorFormulario.set('');

    void submit(this.productoForm, async () => {
      const datos = this.productoModel();
      const request = {
        nombre: datos.nombre.trim(),
        descripcion: datos.descripcion.trim() || null,
        // Se redondea a 2 decimales antes de mandarlo
        precio: Math.round((datos.precio ?? 0) * 100) / 100,
      };
      const id = this.productoEditandoId();

      this.guardando.set(true);
      try {
        if (id === null) {
          await firstValueFrom(this.productosApi.crear(request));
          this.mostrarExito('Producto registrado correctamente.');
        } else {
          await firstValueFrom(this.productosApi.actualizar(id, request));
          this.mostrarExito('Producto actualizado correctamente.');
        }
        this.formDialogRef?.close();
        await this.cargarProductos();
      } catch (error: unknown) {
        this.errorFormulario.set(obtenerMensajeError(error, 'No fue posible guardar el producto.'));
      } finally {
        this.guardando.set(false);
      }
    });
  }

  solicitarEliminar(producto: Producto): void {
    this.productoAEliminar.set(producto);
    this.deleteDialogRef = this.dialog.open(this.eliminarProductoDialog(), {
      autoFocus: false,
      disableClose: true,
      maxWidth: '28rem',
      width: 'calc(100vw - 2rem)',
    });
    this.deleteDialogRef.afterClosed().subscribe(() => {
      this.deleteDialogRef = null;
      this.productoAEliminar.set(null);
    });
  }

  cancelarEliminar(): void {
    if (!this.eliminando()) {
      this.deleteDialogRef?.close();
    }
  }

  async confirmarEliminar(): Promise<void> {
    const producto = this.productoAEliminar();
    if (!producto || this.eliminando()) {
      return;
    }

    this.eliminando.set(true);
    this.errorCarga.set('');
    try {
      await firstValueFrom(this.productosApi.eliminar(producto.id));
      this.mostrarExito('Producto eliminado correctamente.');
      await this.cargarProductos();
    } catch (error: unknown) {
      // Por ejemplo: el producto ya aparece en una venta y la API no deja borrarlo
      this.errorCarga.set(obtenerMensajeError(error, 'No fue posible eliminar el producto.'));
    } finally {
      this.eliminando.set(false);
      this.deleteDialogRef?.close();
    }
  }

  reintentar(): void {
    void this.cargarProductos();
  }

  private abrirFormularioDialog(): void {
    this.errorFormulario.set('');
    this.formDialogRef = this.dialog.open(this.productoFormDialog(), {
      autoFocus: 'first-tabbable',
      maxWidth: '32rem',
      restoreFocus: true,
      width: 'calc(100vw - 2rem)',
    });
    this.formDialogRef.afterClosed().subscribe(() => {
      this.formDialogRef = null;
      this.productoEditandoId.set(null);
      this.errorFormulario.set('');
    });
  }

  private mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 4500 });
  }

  private async cargarProductos(): Promise<void> {
    this.cargando.set(true);
    this.errorCarga.set('');
    try {
      const productos = await firstValueFrom(
        this.productosApi.obtenerTodos(this.busquedaAplicada() || undefined),
      );
      this.productos.set(productos);
    } catch (error: unknown) {
      this.errorCarga.set(obtenerMensajeError(error, 'No fue posible cargar los productos.'));
    } finally {
      this.cargando.set(false);
    }
  }
}
