// child-category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { SubCategory } from './sub-category.entity';

@Entity('ChildCategory') // Nombre real de la tabla si aplica
export class ChildCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  subCategoryId: number;

  @Column()
  entityId: number;

  @ManyToOne(() => SubCategory, (sub) => sub.childCategories)
  subCategory: SubCategory;
}
