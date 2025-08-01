import { IsString, IsArray, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class UpdateProductDto {
  readonly _id: string;
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly shortDescription?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @IsOptional()
  readonly quantity?: number;

  @IsNumber()
  @IsOptional()
  readonly price?: number;

  @IsArray()
  @IsOptional()
  readonly images?: string[];

  @IsString()
  @IsOptional()
  readonly category: string;

  @IsString()
  @IsOptional()
  readonly subcategory: string;

  @IsString()
  @IsOptional()
  readonly childCategory: string;

  @IsString()
  @IsOptional()
  readonly child: string;

  @IsBoolean()
  @IsOptional()
  readonly isAvaible?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly isSoldOut?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly hasDiscount?: boolean;

  @IsNumber()
  @IsOptional()
  readonly discount?: number;


}
