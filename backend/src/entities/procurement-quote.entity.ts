import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProcurementSupplier } from './procurement-supplier.entity';
import { ProcurementOrder } from './procurement-order.entity';

export enum QuoteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Entity('procurement_quotes')
export class ProcurementQuote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quoteNumber: string;

  @ManyToOne(() => ProcurementSupplier, (supplier) => supplier.quotes)
  @JoinColumn({ name: 'supplier_id' })
  supplier: ProcurementSupplier;

  @Column()
  supplierId: string;

  @ManyToOne(() => ProcurementOrder, (order) => order.quotes, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: ProcurementOrder;

  @Column({ nullable: true })
  orderId: string;

  @Column({
    type: 'enum',
    enum: QuoteStatus,
    default: QuoteStatus.PENDING,
  })
  status: QuoteStatus;

  @Column({ type: 'date' })
  quoteDate: Date;

  @Column({ type: 'date' })
  validUntil: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'text', nullable: true })
  terms: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

