import { IsOptional, IsInt, IsString, Min, isBoolean, IsBoolean } from "class-validator";

export class ProductQueryDto {
    @IsOptional()
    @IsString()
    category?: string;
    @IsOptional()
    @IsString()
    subcategory?: string;

    @IsOptional()
    @IsString()
    childCategory?: string;

    @IsOptional()
    @IsString()
    page?: string;

    @IsOptional()
    @IsString()
    limit?: string;

    @IsOptional()
    @IsString()
    filterField?: string;

    @IsOptional()
    @IsString()
    includeAvailable?: string;
    @IsOptional()
    @IsString()
    includeSoldOut?: string;

    @IsOptional()
    @IsString()
    includePublish?: string;

    @IsOptional()
    @IsString()
    onlyFeatured?: string;

    @IsOptional()
    @IsString()
    hasDiscount?: string;

    @IsOptional()
    @IsString()
    discount?: string;

    @IsOptional()
    @IsString()
    sort?: 'mostRelevant' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc';
}