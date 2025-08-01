import exp from "constants";
import { Column, Entity, ForeignKey, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SocialMedia } from "./SocialMedia.entity";

@Entity("Business")
export class Business {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    phonenumber: string;

    @Column()
    email: string;

    @Column()
    googleMapsUrl: string;

    @Column()
    iconUrl: string;

    @Column()
    legendUrl: Date;

    @Column()
    logoUrl: string;

    @Column()
    entityId: number;

    @Column()
    socialMediaId: number;

    @OneToOne(() => SocialMedia)
    @JoinColumn({ name: 'socialMediaId' })
    socialMedia: SocialMedia;
}
