import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Domains")
export class Domain{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    domain: string;

    @Column()
    isActive: boolean;

    @Column()
    entityId: number;
}