import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasController } from './ventas.controller.js';
import { VentasService } from './ventas.service.js';
import { VentaEntity } from './entities/venta.entity.js';
import { VentaDetalleEntity } from './entities/venta-detalle.entity.js';
import { PersonaEntity } from '../personas/entities/persona.entity.js';
import { ProductoEntity } from '../productos/entities/producto.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VentaEntity,
      VentaDetalleEntity,
      PersonaEntity,
      ProductoEntity,
    ]),
  ],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
