import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/sub-category.entity';
import { ChildCategory } from './entities/child-category.entity';

@Injectable()
export class CategoryService {
  /**
   *
   */
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(SubCategory)
    private readonly subCategoryRepo: Repository<SubCategory>,

    @InjectRepository(ChildCategory)
    private readonly ChildCategory: Repository<ChildCategory>
  ) {}

  async findAllByEntity(entityId: number): Promise<Category[]> {
    return this.categoryRepo.find({
      where: { entityId},
      relations : ['subCategories', "subCategories.childCategories"],
      order: {
        name :'ASC',
        subCategories : {
          name : 'ASC',
          childCategories : {
            name: 'ASC'
          }
        }
      }
    })
  }

}
