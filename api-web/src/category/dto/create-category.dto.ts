// dto/create-category.dto.ts
import { IsString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubsubcategoryDto {
  @IsOptional()
  @IsString()
  readonly _id?: string;

  @IsString()
  readonly name: string;
}

export class CreateSubcategoryDto {
  @IsOptional()
  @IsString()
  readonly _id?: string;

  @IsString()
  readonly name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubsubcategoryDto)
  readonly children: CreateSubsubcategoryDto[];
}

export class CreateCategoryDto {
  @IsOptional()
  @IsString()
  readonly _id?: string;

  @IsString()
  readonly name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubcategoryDto)
  readonly subcategories: CreateSubcategoryDto[];
}
