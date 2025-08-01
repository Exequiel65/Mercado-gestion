import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, IsUrl, ValidateNested } from "class-validator";



class CartDto {
    @IsBoolean()
    hasPaymentMethod: boolean;

    @IsBoolean()
    redirectToWsp: boolean;

    @IsBoolean()
    hasApplyCoupon: boolean;
}

class ShippingDto {
    @IsBoolean()
    enabled: boolean;

    @IsBoolean()
    hasFreeShipping: boolean;

    @IsNumber()
    freeShippingMinAmount: number;

    @IsString()
    title: string;

    @IsString()
    description: string;
}

class GuaranteedDevolutionDto {
    @IsBoolean()
    enabled: boolean;

    @IsNumber()
    day: number;

    @IsString()
    title: string;

    @IsString()
    description: string;
}

class CompanyDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsPhoneNumber()
    phone: string;

    @IsEmail()
    email: string;

    @IsUrl()
    googleMaps: string;
}

class SocialMediaDTO {
    @IsOptional()
    @IsString()
    instagram: string;
    @IsOptional()
    @IsString()
    twiter: string;
    @IsOptional()
    @IsString()
    facebook: string;

}

export class CreateSettingDto {

    @IsNumber()
    @IsNotEmpty()
    readonly profitMargin: number;

    @IsNumber()
    @IsNotEmpty()
    readonly dollarRate: number;


    @IsBoolean()
    haveAuth: boolean;

    @ValidateNested()
    @Type(() => CartDto)
    cart: CartDto;

    @ValidateNested()
    @Type(() => ShippingDto)
    shipping: ShippingDto;

    @ValidateNested()
    @Type(() => GuaranteedDevolutionDto)
    guaranteedDevolution: GuaranteedDevolutionDto;

    @ValidateNested()
    @Type(() => CompanyDto)
    company: CompanyDto;

    @IsBoolean()
    hasSubscription: boolean;

    @IsBoolean()
    isMaintenance: boolean;

    @IsOptional()
    @Type(() => SocialMediaDTO)
    socialMedia: SocialMediaDTO
}
