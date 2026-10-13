import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonasController } from './personas.controller.js';
import { PersonasService } from './personas.service.js';
import { PersonaEntity } from './entities/persona.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([PersonaEntity])],
  controllers: [PersonasController],
  providers: [PersonasService],
})
export class PersonasModule {}
