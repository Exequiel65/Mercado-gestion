import { Column, Entity, ForeignKey, PrimaryGeneratedColumn } from "typeorm";
import { BannerGrid } from "./bannerGrid.entity";

@Entity('ItemBannerGrid')
export class ItemBannerGrid 
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image:string;

    @Column()
    title: string;

    @Column()
    subtitle: string;

    @Column()
    textButton: string;

    @Column()
    linkButton: string;

    @Column()
    theme: string;

    @Column()
    priority: number;

    @Column()
    @ForeignKey(() => BannerGrid)
    bannerGridId: number;

    @Column()
    entityId: number;
}