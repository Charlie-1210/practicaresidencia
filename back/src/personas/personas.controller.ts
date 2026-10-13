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
import { PersonasService } from './personas.service.js';
import { CreatePersonaDto } from './dto/create-persona.dto.js';
import { UpdatePersonaDto } from './dto/update-persona.dto.js';
import { PersonaEntity } from './entities/persona.entity.js';

@Controller('personas')
export class PersonasController {
  constructor(private readonly personasService: PersonasService) {}

  // POST /personas
  @Post()
  create(@Body() createPersonaDto: CreatePersonaDto): Promise<PersonaEntity> {
    return this.personasService.create(createPersonaDto);
  }

  // GET /personas?search=texto
  @Get()
  findAll(@Query('search') search?: string): Promise<Array<PersonaEntity>> {
    return this.personasService.findAll(search);
  }

  // GET /personas/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PersonaEntity> {
    return this.personasService.findOne(id);
  }

  // PATCH /personas/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonaDto: UpdatePersonaDto,
  ): Promise<PersonaEntity> {
    return this.personasService.update(id, updatePersonaDto);
  }

  // DELETE /personas/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.personasService.remove(id);
  }
}
