import { IsNotEmpty, IsOptional, Length } from 'class-validator';

// Datos para actualizar una colonia (todo es opcional)
export class UpdateColoniaDto {
  @IsOptional()
  @IsNotEmpty({
    message: 'El nombre no puede estar vacío',
  })
  nombre?: string;

  @IsOptional()
  @IsNotEmpty({
    message: 'El código postal no puede estar vacío',
  })
  @Length(5, 5, {
    message: 'El código postal debe tener exactamente 5 caracteres',
  })
  codigoPostal?: string;
}
