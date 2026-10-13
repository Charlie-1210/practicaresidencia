import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import { ProductoEntity } from './entities/producto.entity.js';
import { esErrorDeLlaveForanea } from '../common/es-error-de-llave-foranea.js';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly repositorioProductos: Repository<ProductoEntity>,
  ) {}

  // Crear un producto
  create(createProductoDto: CreateProductoDto): Promise<ProductoEntity> {
    return this.repositorioProductos.save(createProductoDto);
  }

  // Listar productos. Si llega "search", filtra por nombre
  findAll(search?: string): Promise<Array<ProductoEntity>> {
    const texto = search?.trim();
    return this.repositorioProductos.find({
      where: texto ? { nombre: Like(`%${texto}%`) } : undefined,
      order: { id: 'ASC' },
    });
  }

  // Buscar producto por id. Si no existe, responde 404
  async findOne(id: number): Promise<ProductoEntity> {
    const producto = await this.repositorioProductos.findOne({
      where: { id },
    });
    if (!producto) {
      throw new NotFoundException(`No existe el producto con id ${id}`);
    }
    return producto;
  }

  // Actualizar producto (solo los campos que se envíen) y regresar cómo quedó
  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<ProductoEntity> {
    await this.findOne(id);
    await this.repositorioProductos.update(id, updateProductoDto);
    return this.findOne(id);
  }

  // Eliminar producto. Si ya aparece en alguna venta, MySQL no deja borrarlo
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    try {
      await this.repositorioProductos.delete(id);
    } catch (error: unknown) {
      if (esErrorDeLlaveForanea(error)) {
        throw new ConflictException(
          'No se puede eliminar el producto porque ya aparece en ventas registradas',
        );
      }
      throw error;
    }
  }
}
