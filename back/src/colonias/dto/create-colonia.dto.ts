import { IsNotEmpty, Length } from 'class-validator';

// Datos para crear una colonia
export class CreateColoniaDto {
  @IsNotEmpty({
    message: 'El nombre no puede estar vacío',
  })
  nombre: string;

  @IsNotEmpty({
    message: 'El código postal no puede estar vacío',
  })
  @Length(5, 5, {
    message: 'El código postal debe tener exactamente 5 caracteres',
  })
  codigoPostal: string;
}
