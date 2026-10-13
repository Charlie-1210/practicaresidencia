import { ValueTransformer } from 'typeorm';

// MySQL regresa las columnas DECIMAL como texto ("25.50").
// Este transformador las convierte a número al leerlas,
// para que el front reciba 25.5 y pueda hacer cuentas con él.
export const decimalTransformer: ValueTransformer = {
  to: (valor: number | null) => valor,
  from: (valor: string | null) => (valor === null ? null : Number(valor)),
};
