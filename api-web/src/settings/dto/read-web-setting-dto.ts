import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class CartDto {
  @Expose() hasPaymentMethod: boolean;
  @Expose() redirectToWsp: boolean;
  @Expose() hasApplyCoupon: boolean;
}

@Exclude()
export class ShippingDto {
  @Expose() enabled: boolean;
  @Expose() hasFreeShipping: boolean;
  @Expose() freeShippingMinAmount: number;
  @Expose() title: string;
  @Expose() description: string;
}

@Exclude()
export class GuaranteedDevolutionDto {
  @Expose() enabled: boolean;
  @Expose() day: number;
  @Expose() title: string;
  @Expose() description: string;
}

@Exclude()
export class CompanyDto {
  @Expose() name: string;
  @Expose() address: string;
  @Expose() phone: string;
  @Expose() email: string;
  @Expose() googleMaps: string;
  @Expose() iconUrl: string;
  @Expose() legendUrl: string;
  @Expose() logoUrl: string;
}

@Exclude()
export class SocialMediaDTO {
  @Expose() instagram: string;
  @Expose() facebook: string;
  @Expose() twitter: string;
}


@Exclude()
export class ReadSettingDto {
  @Expose() haveAuth: boolean;

  @Expose() @Type(() => CartDto) cart: CartDto;
  @Expose() @Type(() => ShippingDto) shipping: ShippingDto;
  @Expose() @Type(() => GuaranteedDevolutionDto) guaranteedDevolution: GuaranteedDevolutionDto;
  @Expose() @Type(() => CompanyDto) company: CompanyDto;

  @Expose() hasSubscription: boolean;
  @Expose() isMaintenance: boolean;

  @Expose() @Type(() => SocialMediaDTO) socialMedia: SocialMediaDTO;
}