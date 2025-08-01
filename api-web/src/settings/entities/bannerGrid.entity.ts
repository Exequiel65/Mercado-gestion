import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("BannerGrid")
export class BannerGrid 
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    entityId: number;

}