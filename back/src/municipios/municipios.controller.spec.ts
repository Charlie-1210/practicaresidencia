import { Test, TestingModule } from '@nestjs/testing';
import { MunicipiosController } from './municipios.controller.js';
import { MunicipiosService } from './municipios.service.js';

describe('MunicipiosController', () => {
  let controller: MunicipiosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MunicipiosController],
      providers: [MunicipiosService],
    }).compile();

    controller = module.get<MunicipiosController>(MunicipiosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
