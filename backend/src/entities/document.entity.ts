import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Vessel } from './vessel.entity';
import { Category } from './category.entity';
import { User } from './user.entity';
import { Certificate } from './certificate.entity';

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  filePath: string;

  @Column()
  fileName: string;

  @Column()
  fileSize: number;

  @Column()
  mimeType: string;

  @Column({ nullable: true })
  fileHash: string;

  @Column({ default: 1 })
  version: number;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.DRAFT,
  })
  status: DocumentStatus;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Vessel, (vessel) => vessel.documents)
  @JoinColumn({ name: 'vessel_id' })
  vessel: Vessel;

  @Column()
  vesselId: string;

  @ManyToOne(() => Category, (category) => category.documents)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  categoryId: string;

  @ManyToOne(() => User, (user) => user.documents)
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: User;

  @Column()
  uploadedById: string;

  @OneToOne(() => Certificate, (certificate) => certificate.document)
  certificate: Certificate;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

