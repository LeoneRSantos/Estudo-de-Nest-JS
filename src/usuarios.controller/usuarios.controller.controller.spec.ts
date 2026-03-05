import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosControllerController } from './usuarios.controller.controller';

describe('UsuariosControllerController', () => {
  let controller: UsuariosControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosControllerController],
    }).compile();

    controller = module.get<UsuariosControllerController>(UsuariosControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
