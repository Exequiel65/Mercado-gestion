// sub-category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { ChildCategory } from './child-category.entity';

@Entity('SubCategory') // Nombre real de la tabla si aplica
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  categoryId: number;

  @Column()
  entityId: number;

  @ManyToOne(() => Category, (category) => category.subCategories)
  category: Category;

  @OneToMany(() => ChildCategory, (child) => child.subCategory)
  childCategories: ChildCategory[];
}
