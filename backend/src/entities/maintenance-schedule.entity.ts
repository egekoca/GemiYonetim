import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Vessel } from './vessel.entity';
import { MaintenanceTask } from './maintenance-task.entity';

export enum ScheduleFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  HOURS = 'HOURS',
  MILEAGE = 'MILEAGE',
}

@Entity('maintenance_schedules')
export class MaintenanceSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Vessel)
  @JoinColumn({ name: 'vessel_id' })
  vessel: Vessel;

  @Column()
  vesselId: string;

  @Column({
    type: 'enum',
    enum: ScheduleFrequency,
  })
  frequency: ScheduleFrequency;

  @Column({ type: 'int', nullable: true })
  intervalValue: number;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => MaintenanceTask, (task) => task.schedule)
  tasks: MaintenanceTask[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

