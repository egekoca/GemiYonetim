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
import { ProcurementRequest } from './procurement-request.entity';
import { ProcurementSupplier } from './procurement-supplier.entity';
import { ProcurementQuote } from './procurement-quote.entity';
import { User } from './user.entity';

export enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  ORDERED = 'ORDERED',
  RECEIVED = 'RECEIVED',
  INVOICED = 'INVOICED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

@Entity('procurement_orders')
export class ProcurementOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderNumber: string;

  @ManyToOne(() => ProcurementRequest, (request) => request.orders)
  @JoinColumn({ name: 'request_id' })
  request: ProcurementRequest;

  @Column()
  requestId: string;

  @ManyToOne(() => ProcurementSupplier, (supplier) => supplier.orders)
  @JoinColumn({ name: 'supplier_id' })
  supplier: ProcurementSupplier;

  @Column()
  supplierId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.DRAFT,
  })
  status: OrderStatus;

  @Column({ type: 'date' })
  orderDate: Date;

  @Column({ type: 'date', nullable: true })
  expectedDeliveryDate: Date;

  @Column({ type: 'date', nullable: true })
  actualDeliveryDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'text', nullable: true })
  terms: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column()
  createdById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approvedBy: User;

  @Column({ nullable: true })
  approvedById: string;

  @OneToMany(() => ProcurementQuote, (quote) => quote.order)
  quotes: ProcurementQuote[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

