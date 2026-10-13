import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

// Datos para crear un producto
export class CreateProductoDto {
  @IsNotEmpty({
    message: 'El nombre no puede estar vacío',
  })
  @MaxLength(150, {
    message: 'El nombre no puede tener más de 150 caracteres',
  })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  descripcion?: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número con máximo 2 decimales' },
  )
  @Min(0.01, { message: 'El precio debe ser mayor a 0' })
  precio: number;
}
