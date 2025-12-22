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

export enum PSCStatus {
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  PARTIAL = 'PARTIAL',
}

@Entity('psc_checklists')
export class PSCChecklist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vessel)
  @JoinColumn({ name: 'vessel_id' })
  vessel: Vessel;

  @Column()
  vesselId: string;

  @Column({ type: 'date' })
  inspectionDate: Date;

  @Column({ nullable: true })
  port: string;

  @Column({ nullable: true })
  inspector: string;

  @Column({
    type: 'enum',
    enum: PSCStatus,
    default: PSCStatus.COMPLIANT,
  })
  overallStatus: PSCStatus;

  @Column({ type: 'jsonb', nullable: true })
  checklistItems: {
    category: string;
    item: string;
    status: 'COMPLIANT' | 'NON_COMPLIANT' | 'N/A';
    notes?: string;
  }[];

  @Column({ type: 'text', nullable: true })
  deficiencies: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'prepared_by' })
  preparedBy: User;

  @Column({ nullable: true })
  preparedById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

