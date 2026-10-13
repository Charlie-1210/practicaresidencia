import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from './productos.controller.js';
import { ProductosService } from './productos.service.js';
import { ProductoEntity } from './entities/producto.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity])],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
