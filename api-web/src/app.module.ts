import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { SettingsModule } from './settings/settings.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EntityInterceptor } from './Middleware/EntityMiddleware.interceptor';
import { TermsPolicyModule } from './terms-policy/terms-policy.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env',
        `.env.${process.env.NODE_ENV || 'development'}`,
      ]
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 1433,
      username: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || 'vps123456!',
      database: process.env.DB_NAME || 'CommerceManager',
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    ProductModule,
    CategoryModule,
    SettingsModule,
    TermsPolicyModule
  ],
  controllers: [AppController],
  providers: [
    { 
      provide: APP_INTERCEPTOR, 
      useClass:  EntityInterceptor
    }, 
    AppService]
})
export class AppModule { }
