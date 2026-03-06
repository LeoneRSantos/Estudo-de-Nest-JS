import { Module } from '@nestjs/common';
import { UsuariosControllerController } from './usuarios.controller/usuarios.controller.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsuariosControllerController],
})
export class AppModule { }
