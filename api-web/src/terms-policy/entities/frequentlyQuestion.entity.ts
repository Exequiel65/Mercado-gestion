import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("FrequentlyQuestion")
export class FrequentlyQuestion {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt?: Date;

    @Column()
    entityId: number;
}