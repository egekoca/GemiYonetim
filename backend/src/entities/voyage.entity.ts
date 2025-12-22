import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Vessel } from './vessel.entity';
import { PortCall } from './port-call.entity';
import { VoyageExpense } from './voyage-expense.entity';

export enum VoyageStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('voyages')
export class Voyage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  voyageNumber: string;

  @ManyToOne(() => Vessel)
  @JoinColumn({ name: 'vessel_id' })
  vessel: Vessel;

  @Column()
  vesselId: string;

  @Column({
    type: 'enum',
    enum: VoyageStatus,
    default: VoyageStatus.PLANNED,
  })
  status: VoyageStatus;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  originPort: string;

  @Column({ nullable: true })
  destinationPort: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fuelConsumed: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalExpenses: number;

  @OneToMany(() => PortCall, (portCall) => portCall.voyage)
  portCalls: PortCall[];

  @OneToMany(() => VoyageExpense, (expense) => expense.voyage)
  expenses: VoyageExpense[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

