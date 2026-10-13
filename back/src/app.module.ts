import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ColoniasModule } from './colonias/colonias.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { UsuarioEntity } from './usuarios/entities/usuario.entity.js';
import { AuthModule } from './auth/auth.module.js';
import { ColoniaEntity } from './colonias/entities/colonia.entity.js';
import { MunicipiosModule } from './municipios/municipios.module.js';
import { MunicipioEntity } from './municipios/entities/municipio.entity.js';
import { PersonasModule } from './personas/personas.module.js';
import { PersonaEntity } from './personas/entities/persona.entity.js';
import { ProductosModule } from './productos/productos.module.js';
import { ProductoEntity } from './productos/entities/producto.entity.js';
import { VentasModule } from './ventas/ventas.module.js';
import { VentaEntity } from './ventas/entities/venta.entity.js';
import { VentaDetalleEntity } from './ventas/entities/venta-detalle.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [
          UsuarioEntity,
          ColoniaEntity,
          MunicipioEntity,
          PersonaEntity,
          ProductoEntity,
          VentaEntity,
          VentaDetalleEntity,
        ],
        synchronize: true,
        // MySQL (en Docker) guarda las fechas en UTC. Con 'Z' el back las lee
        // como UTC y el navegador las muestra en la hora local de México.
        timezone: 'Z',
      }),
      inject: [ConfigService],
    }),
    ColoniasModule,
    UsuariosModule,
    MunicipiosModule,
    AuthModule,
    PersonasModule,
    ProductosModule,
    VentasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
