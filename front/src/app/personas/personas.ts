import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { email, form, FormField, pattern, required, submit } from '@angular/forms/signals';
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
import { type Persona, PersonasApi } from './personas-api';
import { obtenerMensajeError } from '../shared/mensaje-error';

interface PersonaForm {
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
}

const PERSONA_VACIA: PersonaForm = { nombre: '', apellidos: '', telefono: '', email: '' };

@Component({
  selector: 'app-personas',
  imports: [
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
  templateUrl: './personas.html',
  styleUrl: '../shared/crud-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Personas implements OnInit {
  private readonly personasApi = inject(PersonasApi);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  private formDialogRef: MatDialogRef<unknown> | null = null;
  private deleteDialogRef: MatDialogRef<unknown> | null = null;

  readonly personaFormDialog = viewChild.required<TemplateRef<unknown>>('personaFormDialog');
  readonly eliminarPersonaDialog =
    viewChild.required<TemplateRef<unknown>>('eliminarPersonaDialog');

  readonly displayedColumns = ['id', 'nombre', 'telefono', 'email', 'acciones'];

  // Estado de la pantalla
  readonly personas = signal<Persona[]>([]);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly eliminando = signal(false);
  readonly errorCarga = signal('');
  readonly errorFormulario = signal('');
  readonly busquedaAplicada = signal('');

  // null = creando una persona nueva; un número = editando esa persona
  readonly personaEditandoId = signal<number | null>(null);
  readonly personaAEliminar = signal<Persona | null>(null);

  // Formulario de búsqueda
  readonly filtrosModel = signal({ search: '' });
  readonly filtrosForm = form(this.filtrosModel);

  // Formulario de crear/editar (es el mismo para las dos cosas)
  readonly personaModel = signal<PersonaForm>({ ...PERSONA_VACIA });
  readonly personaForm = form(this.personaModel, (path) => {
    required(path.nombre, { message: 'Ingresa el nombre.' });
    required(path.apellidos, { message: 'Ingresa los apellidos.' });
    pattern(path.telefono, /^\d{10}$/, { message: 'El teléfono debe tener 10 dígitos.' });
    email(path.email, { message: 'Ingresa un correo electrónico válido.' });
  });

  ngOnInit(): void {
    void this.cargarPersonas();
  }

  onFiltrosSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.busquedaAplicada.set(this.filtrosModel().search.trim());
    void this.cargarPersonas();
  }

  limpiarBusqueda(): void {
    this.filtrosForm().reset({ search: '' });
    this.busquedaAplicada.set('');
    void this.cargarPersonas();
  }

  abrirCrear(): void {
    this.personaEditandoId.set(null);
    this.personaForm().reset({ ...PERSONA_VACIA });
    this.abrirFormularioDialog();
  }

  abrirEditar(persona: Persona): void {
    this.personaEditandoId.set(persona.id);
    this.personaForm().reset({
      nombre: persona.nombre,
      apellidos: persona.apellidos,
      telefono: persona.telefono ?? '',
      email: persona.email ?? '',
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

    void submit(this.personaForm, async () => {
      const datos = this.personaModel();
      // Los campos opcionales vacíos se mandan como null
      const request = {
        nombre: datos.nombre.trim(),
        apellidos: datos.apellidos.trim(),
        telefono: datos.telefono.trim() || null,
        email: datos.email.trim() || null,
      };
      const id = this.personaEditandoId();

      this.guardando.set(true);
      try {
        if (id === null) {
          await firstValueFrom(this.personasApi.crear(request));
          this.mostrarExito('Persona registrada correctamente.');
        } else {
          await firstValueFrom(this.personasApi.actualizar(id, request));
          this.mostrarExito('Persona actualizada correctamente.');
        }
        this.formDialogRef?.close();
        await this.cargarPersonas();
      } catch (error: unknown) {
        this.errorFormulario.set(obtenerMensajeError(error, 'No fue posible guardar la persona.'));
      } finally {
        this.guardando.set(false);
      }
    });
  }

  solicitarEliminar(persona: Persona): void {
    this.personaAEliminar.set(persona);
    this.deleteDialogRef = this.dialog.open(this.eliminarPersonaDialog(), {
      autoFocus: false,
      disableClose: true,
      maxWidth: '28rem',
      width: 'calc(100vw - 2rem)',
    });
    this.deleteDialogRef.afterClosed().subscribe(() => {
      this.deleteDialogRef = null;
      this.personaAEliminar.set(null);
    });
  }

  cancelarEliminar(): void {
    if (!this.eliminando()) {
      this.deleteDialogRef?.close();
    }
  }

  async confirmarEliminar(): Promise<void> {
    const persona = this.personaAEliminar();
    if (!persona || this.eliminando()) {
      return;
    }

    this.eliminando.set(true);
    this.errorCarga.set('');
    try {
      await firstValueFrom(this.personasApi.eliminar(persona.id));
      this.mostrarExito('Persona eliminada correctamente.');
      await this.cargarPersonas();
    } catch (error: unknown) {
      // Por ejemplo: la persona ya tiene ventas y la API no deja borrarla
      this.errorCarga.set(obtenerMensajeError(error, 'No fue posible eliminar la persona.'));
    } finally {
      this.eliminando.set(false);
      this.deleteDialogRef?.close();
    }
  }

  reintentar(): void {
    void this.cargarPersonas();
  }

  private abrirFormularioDialog(): void {
    this.errorFormulario.set('');
    this.formDialogRef = this.dialog.open(this.personaFormDialog(), {
      autoFocus: 'first-tabbable',
      maxWidth: '32rem',
      restoreFocus: true,
      width: 'calc(100vw - 2rem)',
    });
    this.formDialogRef.afterClosed().subscribe(() => {
      this.formDialogRef = null;
      this.personaEditandoId.set(null);
      this.errorFormulario.set('');
    });
  }

  private mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 4500 });
  }

  private async cargarPersonas(): Promise<void> {
    this.cargando.set(true);
    this.errorCarga.set('');
    try {
      const personas = await firstValueFrom(
        this.personasApi.obtenerTodas(this.busquedaAplicada() || undefined),
      );
      this.personas.set(personas);
    } catch (error: unknown) {
      this.errorCarga.set(obtenerMensajeError(error, 'No fue posible cargar las personas.'));
    } finally {
      this.cargando.set(false);
    }
  }
}
