import { Module } from '@nestjs/common';
import { ColoniasController } from './colonias.controller.js';
import { ColoniasService } from './colonias.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColoniaEntity } from './entities/colonia.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([ColoniaEntity])],
  controllers: [ColoniasController],
  providers: [ColoniasService],
})
export class ColoniasModule {}
