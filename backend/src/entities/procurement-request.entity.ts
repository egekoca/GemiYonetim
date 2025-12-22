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
import { User } from './user.entity';
import { ProcurementOrder } from './procurement-order.entity';

export enum RequestStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ORDERED = 'ORDERED',
  CANCELLED = 'CANCELLED',
}

@Entity('procurement_requests')
export class ProcurementRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  requestNumber: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.DRAFT,
  })
  status: RequestStatus;

  @Column({ type: 'date' })
  requiredDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedCost: number;

  @ManyToOne(() => Vessel)
  @JoinColumn({ name: 'vessel_id' })
  vessel: Vessel;

  @Column()
  vesselId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requested_by' })
  requestedBy: User;

  @Column()
  requestedById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approvedBy: User;

  @Column({ nullable: true })
  approvedById: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @OneToMany(() => ProcurementOrder, (order) => order.request)
  orders: ProcurementOrder[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

