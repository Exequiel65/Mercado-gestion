import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("Banner")
export class Banner {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column()
    link: string;

    @Column()
    sm: string;

    @Column()
    md: string;

    @Column()
    xl: string;
    
    @Column()
    entityId: number;

}
