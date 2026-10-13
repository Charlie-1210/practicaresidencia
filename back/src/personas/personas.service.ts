import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreatePersonaDto } from './dto/create-persona.dto.js';
import { UpdatePersonaDto } from './dto/update-persona.dto.js';
import { PersonaEntity } from './entities/persona.entity.js';
import { esErrorDeLlaveForanea } from '../common/es-error-de-llave-foranea.js';

@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(PersonaEntity)
    private readonly repositorioPersonas: Repository<PersonaEntity>,
  ) {}

  // Crear una persona
  create(createPersonaDto: CreatePersonaDto): Promise<PersonaEntity> {
    return this.repositorioPersonas.save(createPersonaDto);
  }

  // Listar personas. Si llega "search", filtra por nombre, apellidos o correo
  findAll(search?: string): Promise<Array<PersonaEntity>> {
    const texto = search?.trim();
    return this.repositorioPersonas.find({
      where: texto
        ? [
            { nombre: Like(`%${texto}%`) },
            { apellidos: Like(`%${texto}%`) },
            { email: Like(`%${texto}%`) },
          ]
        : undefined,
      order: { id: 'ASC' },
    });
  }

  // Buscar persona por id. Si no existe, responde 404
  async findOne(id: number): Promise<PersonaEntity> {
    const persona = await this.repositorioPersonas.findOne({ where: { id } });
    if (!persona) {
      throw new NotFoundException(`No existe la persona con id ${id}`);
    }
    return persona;
  }

  // Actualizar persona (solo los campos que se envíen) y regresar cómo quedó
  async update(
    id: number,
    updatePersonaDto: UpdatePersonaDto,
  ): Promise<PersonaEntity> {
    await this.findOne(id);
    await this.repositorioPersonas.update(id, updatePersonaDto);
    return this.findOne(id);
  }

  // Eliminar persona. Si ya tiene ventas, MySQL no deja borrarla
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    try {
      await this.repositorioPersonas.delete(id);
    } catch (error: unknown) {
      if (esErrorDeLlaveForanea(error)) {
        throw new ConflictException(
          'No se puede eliminar la persona porque tiene ventas registradas',
        );
      }
      throw error;
    }
  }
}
