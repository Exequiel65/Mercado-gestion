import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("Policy")
export class Policy {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt?: Date;

    @Column()
    entityId: number;
}