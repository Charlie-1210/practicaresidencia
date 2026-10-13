import { QueryFailedError } from 'typeorm';

// Devuelve true cuando MySQL rechaza un DELETE porque el registro
// todavía está siendo usado por otra tabla (error 1451).
// Ejemplo: borrar una persona que ya tiene ventas.
export function esErrorDeLlaveForanea(error: unknown): boolean {
  if (!(error instanceof QueryFailedError)) {
    return false;
  }
  const driverError = error.driverError as { errno?: number };
  return driverError.errno === 1451;
}
