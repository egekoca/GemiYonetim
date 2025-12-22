import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Voyage } from './voyage.entity';

export enum ExpenseType {
  FUEL = 'FUEL',
  PORT_CHARGES = 'PORT_CHARGES',
  PROVISIONS = 'PROVISIONS',
  REPAIRS = 'REPAIRS',
  CREW_EXPENSES = 'CREW_EXPENSES',
  AGENCY = 'AGENCY',
  OTHER = 'OTHER',
}

@Entity('voyage_expenses')
export class VoyageExpense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Voyage, (voyage) => voyage.expenses)
  @JoinColumn({ name: 'voyage_id' })
  voyage: Voyage;

  @Column()
  voyageId: string;

  @Column({
    type: 'enum',
    enum: ExpenseType,
  })
  expenseType: ExpenseType;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'date' })
  expenseDate: Date;

  @Column({ nullable: true })
  invoiceNumber: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

