import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('WebConfig') // Nombre real de la tabla en SQL Server
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  // Cart
  @Column()
  hasPaymentMethod: boolean;

  @Column()
  redirectToWsp: boolean;

  @Column()
  hasApplyCoupon: boolean;

  // Shipping
  @Column()
  enabledShipping: boolean;

  @Column()
  hasFreeShipping: boolean;

  @Column('decimal', { precision: 18, scale: 2 })
  freeShippingAmount: number;

  @Column()
  titleShipping: string;

  @Column('text')
  descriptionShipping: string;

  // Devolution
  @Column()
  enabledDevolution: boolean;

  @Column()
  devolutionDays: number;

  @Column()
  titleDevolution: string;

  @Column('text')
  descriptionDevolution: string;

  @Column()
  hasSubscription: boolean;

  @Column()
  isMaintenance: boolean;

  @Column()
  enabledWeb: boolean;

  @Column()
  entityId: number;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'datetime' })
  updatedAt: Date;

  @Column()
  updateBy: string;
}
