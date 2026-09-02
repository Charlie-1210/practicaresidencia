import { IsNotEmpty } from 'class-validator';

// Datos para crear un municipio
export class CreateMunicipioDto {
  @IsNotEmpty({
    message: 'El nombre no puede estar vacío',
  })
  nombre: string;
}
