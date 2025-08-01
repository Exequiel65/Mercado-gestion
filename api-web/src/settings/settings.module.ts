import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from './entities/config.entity';
import { Banner } from './entities/banner.entity';
import { Section } from './entities/section.entity';
import { BannerGrid } from './entities/bannerGrid.entity';
import { ItemBannerGrid } from './entities/ItemBannerGrid.entity';
import { Domain } from './entities/domain.entity';
import { Business } from './entities/business.entity';
import { SocialMedia } from './entities/SocialMedia.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Config, Banner, Section, BannerGrid, ItemBannerGrid, Domain, Business, SocialMedia])
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService, TypeOrmModule.forFeature([Domain])],
})
export class SettingsModule {}
