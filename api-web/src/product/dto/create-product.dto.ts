import { ArrayNotEmpty, IsArray, IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly shortDescription?: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNumber()
  @Min(0)
  readonly quantity: number;

  @IsNumber()
  @Min(0)
  readonly price: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly images: string[];

  @IsString()
  readonly category: string;

  @IsString()
  readonly subcategory: string;

  @IsString()
  readonly childCategory: string;
  
  @IsBoolean()
  @IsOptional()
  readonly isAvaible: boolean;

  @IsBoolean()
  @IsOptional()
  readonly isSoldOut: boolean;

  @IsBoolean()
  @IsOptional()
  readonly isFeatured: boolean;

  @IsBoolean()
  @IsOptional()
  readonly hasDiscount?: boolean;

  @IsNumber()
  @IsOptional()
  readonly discount?: number;

}
