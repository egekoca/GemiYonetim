import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProcurementOrder } from './procurement-order.entity';
import { ProcurementQuote } from './procurement-quote.entity';

@Entity('procurement_suppliers')
export class ProcurementSupplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  contactPerson: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  taxNumber: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => ProcurementOrder, (order) => order.supplier)
  orders: ProcurementOrder[];

  @OneToMany(() => ProcurementQuote, (quote) => quote.supplier)
  quotes: ProcurementQuote[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

