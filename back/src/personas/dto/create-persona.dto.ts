import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
} from 'class-validator';

// Datos para crear una persona
export class CreatePersonaDto {
  @IsNotEmpty({
    message: 'El nombre no puede estar vacío',
  })
  @MaxLength(100, {
    message: 'El nombre no puede tener más de 100 caracteres',
  })
  nombre: string;

  @IsNotEmpty({
    message: 'Los apellidos no pueden estar vacíos',
  })
  @MaxLength(150, {
    message: 'Los apellidos no pueden tener más de 150 caracteres',
  })
  apellidos: string;

  // El teléfono es opcional, pero si se manda deben ser 10 dígitos
  @IsOptional()
  @Matches(/^\d{10}$/, {
    message: 'El teléfono debe tener exactamente 10 dígitos',
  })
  telefono?: string;

  // El correo es opcional, pero si se manda debe tener formato válido
  @IsOptional()
  @IsEmail({}, { message: 'El correo no tiene el formato requerido' })
  email?: string;
}
