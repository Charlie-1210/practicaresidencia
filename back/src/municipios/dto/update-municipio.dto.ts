import { IsNotEmpty, IsOptional } from 'class-validator';

// Datos para actualizar un municipio (todo es opcional)
export class UpdateMunicipioDto {
  @IsOptional()
  @IsNotEmpty({
    message: 'El nombre no puede estar vacío',
  })
  nombre?: string;
}
