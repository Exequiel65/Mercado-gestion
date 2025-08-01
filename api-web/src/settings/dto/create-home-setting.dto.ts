// src/dto/home/create-home.dto.ts
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class BannerImagesDto {
  @IsString() sm: string;
  @IsString() md: string;
  @IsString() xl: string;
}

class HomeBannerDto {
  @ValidateNested()
  @Type(() => BannerImagesDto)
  images: BannerImagesDto;

  @IsOptional() @IsString() text?: string;
  @IsOptional() @IsString() link?: string;
}

class HomeButtonDto {
  @IsOptional() @IsString() text?: string;
  @IsOptional() @IsString() path?: string;
  @IsOptional() @IsString() position?: string;
  @IsOptional() @IsString() link?: string;
}

class HomeSectionDto {
  @IsOptional() @IsString() section?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsDateString() endDate?: string;

  @IsOptional() @IsString() position?: string;
  @IsOptional() @IsBoolean() showButtonSlider?: boolean;
  @IsOptional() @IsBoolean() secondLine?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => HomeButtonDto)
  button?: HomeButtonDto;
}

class BannerGridItemDto {
  @IsOptional() @IsString() image?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() subtitle?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => HomeButtonDto)
  button?: HomeButtonDto;

  @IsOptional() @IsString() theme?: string;
  @IsOptional() @IsNumber() priority?: number;
}

class BannerGridDto {
  @IsOptional() @IsString() title?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BannerGridItemDto)
  items: BannerGridItemDto[];
}

export class CreateHomeDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HomeBannerDto)
  banners: HomeBannerDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HomeSectionDto)
  sections: HomeSectionDto[];

  @ValidateNested()
  @Type(() => BannerGridDto)
  bannerGrid: BannerGridDto;
}


