import { Injectable } from '@nestjs/common';
import { CreateColoniaDto } from './dto/create-colonia.dto.js';
import { UpdateColoniaDto } from './dto/update-colonia.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ColoniaEntity } from './entities/colonia.entity.js';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ColoniasService {
  constructor(
    @InjectRepository(ColoniaEntity)
    private readonly repositorioColonias: Repository<ColoniaEntity>,
  ) {}

  create(createColoniaDto: CreateColoniaDto): Promise<ColoniaEntity> {
    return this.repositorioColonias.save(createColoniaDto);
  }

  findAll(): Promise<Array<ColoniaEntity>> {
    return this.repositorioColonias.find();
  }

  findOne(id: number): Promise<ColoniaEntity | null> {
    return this.repositorioColonias.findOne({
      where: {
        id,
      },
    });
  }

  update(
    id: number,
    updateColoniaDto: UpdateColoniaDto,
  ): Promise<UpdateResult> {
    return this.repositorioColonias.update(id, {
      nombre: updateColoniaDto.nombre,
      codigoPostal: updateColoniaDto.codigoPostal,
    });
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repositorioColonias.delete(id);
  }
}
