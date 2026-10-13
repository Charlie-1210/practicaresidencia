import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';

// Una partida que manda el front: solo el producto y la cantidad.
// El precio NO se recibe del front: el back lo toma del catálogo.
export class CreateVentaDetalleDto {
  @IsInt({ message: 'El productoId debe ser un número entero' })
  @Min(1, { message: 'El productoId no es válido' })
  productoId: number;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  cantidad: number;
}

// Datos para registrar una venta
export class CreateVentaDto {
  @IsInt({ message: 'El personaId debe ser un número entero' })
  @Min(1, { message: 'El personaId no es válido' })
  personaId: number;

  // Debe traer al menos una partida, y cada partida se valida por separado
  @IsArray({ message: 'Los detalles deben ser una lista' })
  @ArrayMinSize(1, { message: 'La venta debe tener al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => CreateVentaDetalleDto)
  detalles: CreateVentaDetalleDto[];
}
