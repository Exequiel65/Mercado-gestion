import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductQueryDto } from './dto/query-product-dto';
import { ReadProductDTO } from './dto/read-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaProduct } from './entities/media-product.entity';

@Injectable()
export class ProductService {

    /**
     *
     */
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(MediaProduct)
        private readonly mediaProductRepository: Repository<MediaProduct>
    ) {


    }


    async findAll(entityId: number, query: ProductQueryDto): Promise<ReadProductDTO[]> {
        const { category, subcategory, childCategory, page = '1', limit = '100', filterField, includeAvailable, onlyFeatured, hasDiscount, includePublish, includeSoldOut, discount, sort = 'mostRelevant' } = query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const where: any = {};
        where.entityId = entityId;
        where.isDeleted = false;
        // Filtros por categoría
        if (category) where.categoryId = parseInt(category);
        if (subcategory) where.subCategoryId = parseInt(subcategory);
        if (childCategory) where.childCategoryId = parseInt(childCategory);

        if (includeAvailable !== undefined)
            where.isActive = JSON.parse(includeAvailable);
        else
            where.isActive = true;

        if (includeSoldOut !== undefined)
            where.isSoldOut = JSON.parse(includeSoldOut);

        if (onlyFeatured === 'true') where.isFeatured = true;

        if (hasDiscount === 'true') where.hasDiscount = true;

        if (discount !== undefined) {
            const parsedDiscount = parseFloat(discount);
            if (!isNaN(parsedDiscount)) {
                where.hasDiscount = true;
                where.amountDiscount = { $lte: parsedDiscount };
            }
        }

        const queryBuilder = this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.images', 'images')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory')
            .leftJoinAndSelect('product.childCategory', 'childCategory')
            .where(where);

        if (filterField) {
            queryBuilder.andWhere(
                `(product.name LIKE :search OR product.description LIKE :search)`,
                { search: `%${filterField}%` },
            );
        }
        switch (sort) {
            case 'priceAsc':
                queryBuilder.orderBy('product.price', 'ASC');
                break;
            case 'priceDesc':
                queryBuilder.orderBy('product.price', 'DESC');
                break;
            case 'nameAsc':
                queryBuilder.orderBy('product.name', 'ASC');
                break;
            case 'nameDesc':
                queryBuilder.orderBy('product.name', 'DESC');
                break;
            case 'mostRelevant':
                queryBuilder
                    .addOrderBy('product.isFeatured', 'DESC')
                    .addOrderBy('product.hasDiscount', 'DESC')
                    .addOrderBy('product.isSoldOut', 'ASC')
                    .addOrderBy('product.createdDate', 'DESC');
                break;
            default:
                queryBuilder.orderBy('product.createdDate', 'DESC');
                break;
        }

        queryBuilder.skip(skip).take(limitNum);

        const products = await queryBuilder.getMany();

        // Adaptar a DTO
        return products.map((product) => {
            const dto = new ReadProductDTO();
            dto.id = product.id;
            dto.name = product.name;
            dto.description = product.description;
            dto.quantity = product.stock;
            dto.price = product.price;

            const precioBase = product.price;
            // Math.ceil(
            //     ((product.price +
            //         (product.price * setting.profitMargin) / 100) *
            //         setting.dollarRate) /
            //     100,
            // ) * 100;

            dto.priceConvert = precioBase;

            if (product.hasDiscount && product.amountDiscount) {
                dto.priceConvertWithDiscount = Math.ceil(
                    precioBase - (precioBase * product.amountDiscount) / 100,
                );
            }

            dto.images = product.images?.map((i) => i.mediaUrl) || [];

            dto.category = product.category?.name ?? "";
            dto.subcategory = product.subCategory?.name;
            dto.childCategory = product.childCategory?.name;

            dto.isAvaible = product.isActive;
            dto.isSoldOut = product.isSoldOut;
            dto.isFeatured = product.isFeatured;
            dto.hasDiscount = product.hasDiscount;
            dto.discount = product.amountDiscount ?? 0;

            return dto;
        });
    }

    async findOne(entityId:number,id: number): Promise<ReadProductDTO> {
        const product = await this.productRepository.findOne({
            where: { id, entityId },
            relations: ['images', 'category', 'subCategory', 'childCategory'],
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // const setting = await this.settingsService.find();

        const dto = new ReadProductDTO();
        dto.name = product.name;
        dto.description = product.description;
        dto.quantity = product.stock;
        dto.price = product.price;

        const precioBase = product.price;
        // Math.ceil(
        //     ((product.price + (product.price * setting.profitMargin) / 100) *
        //         setting.dollarRate) /
        //     100,
        // ) * 100;

        dto.priceConvert = precioBase;

        if (product.hasDiscount && product.amountDiscount && product.amountDiscount > 0) {
            dto.priceConvertWithDiscount = Math.ceil(
                precioBase - (precioBase * product.amountDiscount) / 100,
            );
        }

        dto.images = product.images?.map((img) => img.mediaUrl) || [];

        dto.category = product.category?.name ?? "";
        dto.subcategory = product.subCategory?.name;
        dto.childCategory = product.childCategory?.name;

        dto.isAvaible = product.isActive;
        dto.isSoldOut = product.isSoldOut;
        dto.isFeatured = product.isFeatured;
        dto.hasDiscount = product.hasDiscount;
        dto.discount = product.amountDiscount ?? 0;

        return dto;
    }
}
