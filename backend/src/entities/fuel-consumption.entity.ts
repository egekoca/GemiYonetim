import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vessel } from './vessel.entity';
import { User } from './user.entity';

export enum FuelOperationType {
  BUNKER = 'BUNKER',
  CONSUMPTION = 'CONSUMPTION',
  TRANSFER = 'TRANSFER',
}

@Entity('fuel_consumptions')
export class FuelConsumption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vessel)
  @JoinColumn({ name: 'vessel_id' })
  vessel: Vessel;

  @Column()
  vesselId: string;

  @Column({
    type: 'enum',
    enum: FuelOperationType,
  })
  operationType: FuelOperationType;

  @Column({ type: 'date' })
  operationDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalCost: number;

  @Column({ nullable: true })
  tank: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tankLevelBefore: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tankLevelAfter: number;

  @Column({ nullable: true })
  supplier: string;

  @Column({ nullable: true })
  port: string;

  @Column({ type: 'text', nullable: true })
  qualityTest: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'recorded_by' })
  recordedBy: User;

  @Column({ nullable: true })
  recordedById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

