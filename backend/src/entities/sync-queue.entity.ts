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

export enum SyncAction {
  UPLOAD = 'UPLOAD',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
}

export enum SyncStatus {
  PENDING = 'PENDING',
  SYNCED = 'SYNCED',
  FAILED = 'FAILED',
}

@Entity('sync_queue')
export class SyncQueue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vessel, (vessel) => vessel.syncQueues)
  @JoinColumn({ name: 'vessel_id' })
  vessel: Vessel;

  @Column()
  vesselId: string;

  @Column({
    type: 'enum',
    enum: SyncAction,
  })
  action: SyncAction;

  @Column({
    type: 'enum',
    enum: SyncStatus,
    default: SyncStatus.PENDING,
  })
  status: SyncStatus;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @Column({ nullable: true })
  errorMessage: string;

  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

