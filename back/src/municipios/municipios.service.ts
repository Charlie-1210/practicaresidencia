import { Injectable } from '@nestjs/common';
import { CreateMunicipioDto } from './dto/create-municipio.dto.js';
import { UpdateMunicipioDto } from './dto/update-municipio.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { MunicipioEntity } from './entities/municipio.entity.js';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class MunicipiosService {
  constructor(
    @InjectRepository(MunicipioEntity)
    private readonly repositorioMunicipios: Repository<MunicipioEntity>,
  ) {}

  // Crear municipio
  create(createMunicipioDto: CreateMunicipioDto): Promise<MunicipioEntity> {
    return this.repositorioMunicipios.save(createMunicipioDto);
  }

  findAll(): Promise<Array<MunicipioEntity>> {
    return this.repositorioMunicipios.find();
  }

  // Buscar por id
  findOne(id: number): Promise<MunicipioEntity | null> {
    return this.repositorioMunicipios.findOne({
      where: {
        id,
      },
    });
  }

  // Actualizar municipio (solo los campos que se envíen)
  update(
    id: number,
    updateMunicipioDto: UpdateMunicipioDto,
  ): Promise<UpdateResult> {
    return this.repositorioMunicipios.update(id, updateMunicipioDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repositorioMunicipios.delete(id);
  }
}
