import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { MunicipiosService } from './municipios.service.js';
import { CreateMunicipioDto } from './dto/create-municipio.dto.js';
import { UpdateMunicipioDto } from './dto/update-municipio.dto.js';
import { MunicipioEntity } from './entities/municipio.entity.js';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('municipios')
export class MunicipiosController {
  constructor(private readonly municipiosService: MunicipiosService) {}

  // Crear municipio
  @Post()
  create(
    @Body() createMunicipioDto: CreateMunicipioDto,
  ): Promise<MunicipioEntity> {
    return this.municipiosService.create(createMunicipioDto);
  }

  @Get()
  findAll(): Promise<Array<MunicipioEntity>> {
    return this.municipiosService.findAll();
  }

  // Buscar por id
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MunicipioEntity | null> {
    return this.municipiosService.findOne(id);
  }

  // Actualizar municipio
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMunicipioDto: UpdateMunicipioDto,
  ): Promise<UpdateResult> {
    return this.municipiosService.update(id, updateMunicipioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.municipiosService.remove(id);
  }
}
