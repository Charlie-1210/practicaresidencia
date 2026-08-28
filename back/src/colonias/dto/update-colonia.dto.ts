import { IsNotEmpty } from 'class-validator';

export class UpdateColoniaDto {
  @IsNotEmpty({
    message: 'El nombre no puede estar vacío',
  })
  nombre: string;

  @IsNotEmpty({
    message: 'El código postal no puede estar vacío',
  })
  codigoPostal: string;
}
