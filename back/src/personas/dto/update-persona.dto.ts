import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonaDto } from './create-persona.dto.js';

// Datos para actualizar una persona.
// PartialType copia las validaciones de CreatePersonaDto
// y vuelve opcional cada campo: solo se cambia lo que se envíe.
export class UpdatePersonaDto extends PartialType(CreatePersonaDto) {}
