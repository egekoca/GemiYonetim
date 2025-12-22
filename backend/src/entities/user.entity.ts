import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Document } from './document.entity';
import { AuditLog } from './audit-log.entity';

export enum UserRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  DPA_OFFICE = 'DPA_OFFICE',
  CAPTAIN = 'CAPTAIN',
  CHIEF_ENGINEER = 'CHIEF_ENGINEER',
  OFFICER = 'OFFICER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.OFFICER,
  })
  role: UserRole;

  @Column({ nullable: true })
  vesselId: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Document, (document) => document.uploadedBy)
  documents: Document[];

  @OneToMany(() => AuditLog, (auditLog) => auditLog.user)
  auditLogs: AuditLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

