import { Controller, Get, Param, Query, Req, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductQueryDto } from './dto/query-product-dto';



@Controller('product')
export class ProductController {

  constructor(private readonly productService: ProductService) {

  }

  @Get()
  findAll(@Req() req, @Query(new ValidationPipe({ transform: true })) query: ProductQueryDto) {
    const entityId = req["entityId"];
    return this.productService.findAll(entityId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const entityId = req["entityId"];
    return this.productService.findOne(entityId, +id);
  }


}
