import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { SettingsModule } from 'src/settings/settings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaProduct } from './entities/media-product.entity';

@Module({
  imports:[
      TypeOrmModule.forFeature([Product, MediaProduct]),
      SettingsModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
