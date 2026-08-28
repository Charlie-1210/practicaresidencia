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
import { ColoniasService } from './colonias.service.js';
import { CreateColoniaDto } from './dto/create-colonia.dto.js';
import { UpdateColoniaDto } from './dto/update-colonia.dto.js';
import { ColoniaEntity } from './entities/colonia.entity.js';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('colonias')
export class ColoniasController {
  constructor(private readonly coloniasService: ColoniasService) {}

  @Post()
  create(@Body() createColoniaDto: CreateColoniaDto): Promise<ColoniaEntity> {
    return this.coloniasService.create(createColoniaDto);
  }

  @Get()
  findAll(): Promise<Array<ColoniaEntity>> {
    return this.coloniasService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ColoniaEntity | null> {
    return this.coloniasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateColoniaDto: UpdateColoniaDto,
  ): Promise<UpdateResult> {
    return this.coloniasService.update(id, updateColoniaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.coloniasService.remove(id);
  }
}
