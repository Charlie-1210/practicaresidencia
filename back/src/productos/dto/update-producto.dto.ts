import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto.js';

// Datos para actualizar un producto (todo es opcional)
export class UpdateProductoDto extends PartialType(CreateProductoDto) {}
