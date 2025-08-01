import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("SocialMedia")
export class SocialMedia 
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  facebook: string;

  @Column()
  instagram: string;

  @Column()
  twitter: string;

  @Column()
  entityId: number;

}