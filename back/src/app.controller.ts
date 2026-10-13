import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import { TituloResponse } from './dtos/titulo-response.dto.js';
import { PerfilDTO } from './dtos/perfil.dto.js';
import { Public } from './auth/decorators/public.decorator.js';

@Controller('app') // ruta: /app
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Público: el front pide el título antes de que el usuario inicie sesión
  @Public()
  @Get('titulo') // GET /app/titulo
  getHello(): TituloResponse {
    return this.appService.getTituloApp();
  }

  @Get('perfil')
  getHola(): PerfilDTO {
    return this.appService.getPerfil();
  }

  @Post('guardar-nombre') // POST /app/guardar-nombre {nombre: string}
  // body: {nombre:valor}
  guardarNombre(@Body('nombre') nombre: string) {
    if (!nombre) {
      return new HttpException(
        'El nombre es requerido',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (nombre.length < 5) {
      return new HttpException(
        'El nombre no puede tener menos de 5 caracteres',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (nombre.length > 20) {
      return new HttpException(
        'El nombre no puede tener mas de 20 caracteres',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.appService.guardarNombre(nombre);
  }
}

/*
Usuario(Angular) -> 
  Infraestructura(Controllers) Rutas del api
    Validacion de entradas
    Servicios(Services) Impresion, Manipulacion de archivos, apis/servicios de terceros
      Dominio(Repositorios/Entidades) Base de datos
**/
