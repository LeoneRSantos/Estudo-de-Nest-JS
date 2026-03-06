import { Module } from '@nestjs/common';
import { UsuariosControllerController } from './usuarios.controller/usuarios.controller.controller';

@Module({
  imports: [],
  controllers: [UsuariosControllerController],
})
export class AppModule { }
