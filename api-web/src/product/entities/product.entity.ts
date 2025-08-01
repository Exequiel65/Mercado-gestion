import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { SubCategory } from '../../category/entities/sub-category.entity';
import { ChildCategory } from '../../category/entities/child-category.entity';
import { MediaProduct } from './media-product.entity';

@Entity('Product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 18, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column({ type: 'datetime' })
  createdDate: Date;

  @Column({ type: 'datetime' })
  updatedDate: Date;

  @Column()
  createdBy: string;

  @Column({ nullable: true })
  updatedBy?: string;

  @Column()
  isActive: boolean;

  @Column()
  isDeleted: boolean;

  @Column({ type: 'datetime', nullable: true })
  deletedDate?: Date;

  @Column({ nullable: true })
  deletedBy?: string;

  @Column()
  isFeatured: boolean;

  @Column()
  isSoldOut: boolean;

  @Column()
  hasDiscount: boolean;

  @Column('decimal', { precision: 18, scale: 2, nullable: true })
  amountDiscount?: number;

  @Column({ nullable: true })
  categoryId?: number;

  @Column({ nullable: true })
  subCategoryId?: number;

  @Column({ nullable: true })
  childCategoryId?: number;

  @Column()
  entityId: number;

  @ManyToOne(() => Category, { nullable: true })
  category?: Category;

  @ManyToOne(() => SubCategory, { nullable: true })
  subCategory?: SubCategory;

  @ManyToOne(() => ChildCategory, { nullable: true })
  childCategory?: ChildCategory;

  @OneToMany(() => MediaProduct, (media) => media.product)
  images?: MediaProduct[];
}
