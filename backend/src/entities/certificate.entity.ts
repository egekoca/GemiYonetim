import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Document } from './document.entity';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Document, (document) => document.certificate)
  @JoinColumn({ name: 'doc_id' })
  document: Document;

  @Column({ unique: true })
  docId: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date' })
  expiryDate: Date;

  @Column({ type: 'int', default: 30 })
  warningThreshold: number;

  @Column()
  issuingAuthority: string;

  @Column({ nullable: true })
  certificateNumber: string;

  @Column({ default: false })
  isNotified30: boolean;

  @Column({ default: false })
  isNotified60: boolean;

  @Column({ default: false })
  isNotified90: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

