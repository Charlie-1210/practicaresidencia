import { Module } from '@nestjs/common';
import { MunicipiosController } from './municipios.controller.js';
import { MunicipiosService } from './municipios.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MunicipioEntity } from './entities/municipio.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([MunicipioEntity])],
  controllers: [MunicipiosController],
  providers: [MunicipiosService],
})
export class MunicipiosModule {}
