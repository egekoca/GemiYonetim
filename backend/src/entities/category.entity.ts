import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Document } from './document.entity';

export enum CategoryType {
  CERTIFICATE = 'CERTIFICATE',
  TECHNICAL_DRAWING = 'TECHNICAL_DRAWING',
  HSEQ = 'HSEQ',
  JOURNAL = 'JOURNAL',
  TRAINING = 'TRAINING',
  MAINTENANCE = 'MAINTENANCE',
  OTHER = 'OTHER',
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
  })
  type: CategoryType;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Document, (document) => document.category)
  documents: Document[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

