import { HttpErrorResponse } from '@angular/common/http';

// Convierte un error de la API en un mensaje que se puede mostrar al usuario.
// Es la misma lógica que usa la pantalla de usuarios.
export function obtenerMensajeError(error: unknown, mensajePredeterminado: string): string {
  if (!(error instanceof HttpErrorResponse)) {
    return mensajePredeterminado;
  }

  if (error.status === 0) {
    return 'No pudimos conectar con el servidor. Verifica que el back esté disponible.';
  }

  const mensajeBackend = error.error?.message as string | string[] | undefined;

  if (Array.isArray(mensajeBackend)) {
    return mensajeBackend.join(' ');
  }

  return mensajeBackend ?? mensajePredeterminado;
}
