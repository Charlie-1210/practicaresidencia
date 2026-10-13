import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { VentasService } from './ventas.service.js';
import { CreateVentaDto } from './dto/create-venta.dto.js';
import { VentaEntity } from './entities/venta.entity.js';

// Las ventas solo se registran y se consultan (no se editan ni se borran)
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  // POST /ventas
  @Post()
  create(@Body() createVentaDto: CreateVentaDto): Promise<VentaEntity> {
    return this.ventasService.create(createVentaDto);
  }

  // GET /ventas
  @Get()
  findAll(): Promise<Array<VentaEntity>> {
    return this.ventasService.findAll();
  }

  // GET /ventas/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<VentaEntity> {
    return this.ventasService.findOne(id);
  }
}
