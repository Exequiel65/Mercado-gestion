import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('Section') 
export class Section 
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    title: string;

    @Column({nullable: true})
    sectionItem: string;

    @Column({nullable: true})
    textButton: string;

    @Column({nullable: true})
    linkButton: string;

    @Column({nullable: true})
    positionButton: string;

    @Column()
    showButtonSlider: boolean;

    @Column({type: 'datetime'})
    endDate: Date;

    @Column()
    secondLine: boolean;

    @Column()
    entityId: number;
}