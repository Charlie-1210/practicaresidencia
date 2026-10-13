import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductosService } from './productos.service.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import { ProductoEntity } from './entities/producto.entity.js';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // POST /productos
  @Post()
  create(
    @Body() createProductoDto: CreateProductoDto,
  ): Promise<ProductoEntity> {
    return this.productosService.create(createProductoDto);
  }

  // GET /productos?search=texto
  @Get()
  findAll(@Query('search') search?: string): Promise<Array<ProductoEntity>> {
    return this.productosService.findAll(search);
  }

  // GET /productos/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductoEntity> {
    return this.productosService.findOne(id);
  }

  // PATCH /productos/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ): Promise<ProductoEntity> {
    return this.productosService.update(id, updateProductoDto);
  }

  // DELETE /productos/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productosService.remove(id);
  }
}
