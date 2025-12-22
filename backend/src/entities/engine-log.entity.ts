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

@Entity('engine_logs')
export class EngineLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vessel)
  @JoinColumn({ name: 'vessel_id' })
  vessel: Vessel;

  @Column()
  vesselId: string;

  @Column({ type: 'date' })
  logDate: Date;

  @Column({ type: 'time' })
  logTime: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  engineHours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  rpm: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fuelLevel: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  oilPressure: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  waterTemperature: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  exhaustTemperature: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  oilTemperature: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  loadPercentage: number;

  @Column({ type: 'text', nullable: true })
  alarms: string;

  @Column({ type: 'text', nullable: true })
  maintenanceNotes: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'engineer_id' })
  engineer: User;

  @Column({ nullable: true })
  engineerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

