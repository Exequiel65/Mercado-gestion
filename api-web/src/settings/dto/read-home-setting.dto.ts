import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class HomeBannerImageDto {
  @Expose() sm: string;
  @Expose() md: string;
  @Expose() xl: string;
}

@Exclude()
export class HomeBannerDto {

  @Expose() text: string;
  @Expose() link: string;

  @Expose()
  @Type(() => HomeBannerImageDto)
  images: HomeBannerImageDto;
}

@Exclude()
export class HomeButtonDto {
  @Expose() text: string;
  @Expose() path?: string; // usado en section
  @Expose() position?: string; // usado en section
  @Expose() link?: string; // usado en bannerGrid item
}

@Exclude()
export class HomeSectionDto {
  @Expose() section: string;
  @Expose() title: string;
  @Expose() endDate: string;
  @Expose() position: string;
  @Expose() showButtonSlider: boolean;
  @Expose() secondLine: boolean;

  @Expose()
  @Type(() => HomeButtonDto)
  button: HomeButtonDto;
}

@Exclude()
export class BannerGridItemDto {
  @Expose() image: string;
  @Expose() title: string;
  @Expose() subtitle: string;
  @Expose() theme: string;
  @Expose() priority: number;

  @Expose()
  @Type(() => HomeButtonDto)
  button: HomeButtonDto;
}

@Exclude()
export class BannerGridDto {
  @Expose() title: string;

  @Expose()
  @Type(() => BannerGridItemDto)
  items: BannerGridItemDto[];
}

@Exclude()
export class HomeDto {
  @Expose()
  @Type(() => HomeBannerDto)
  banners: HomeBannerDto[];

  @Expose()
  @Type(() => HomeSectionDto)
  sections: HomeSectionDto[];

  @Expose()
  @Type(() => BannerGridDto)
  bannerGrid: BannerGridDto;
}
