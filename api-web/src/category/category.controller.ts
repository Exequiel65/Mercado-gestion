import { Controller, Get, Req} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';


@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(@Req() req): Promise<Category[]> {
    const entityId = req["entityId"];
    return await this.categoryService.findAllByEntity(entityId);
  }

}
