import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosControllerController } from './usuarios.controller/usuarios.controller.controller';

@Module({
  imports: [],
  controllers: [AppController, UsuariosControllerController],
  providers: [AppService],
})
export class AppModule {}
