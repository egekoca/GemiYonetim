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
import { MaintenanceSchedule } from './maintenance-schedule.entity';
import { MaintenanceWorkOrder } from './maintenance-work-order.entity';
import { User } from './user.entity';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Entity('maintenance_tasks')
export class MaintenanceTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Vessel)
  @JoinColumn({ name: 'vessel_id' })
  vessel: Vessel;

  @Column()
  vesselId: string;

  @ManyToOne(() => MaintenanceSchedule, (schedule) => schedule.tasks, { nullable: true })
  @JoinColumn({ name: 'schedule_id' })
  schedule: MaintenanceSchedule;

  @Column({ nullable: true })
  scheduleId: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  completedDate: Date;

  @Column({ nullable: true })
  equipment: string;

  @Column({ nullable: true })
  location: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: User;

  @Column({ nullable: true })
  assignedToId: string;

  @Column({ type: 'int', nullable: true })
  estimatedHours: number;

  @OneToMany(() => MaintenanceWorkOrder, (workOrder) => workOrder.task)
  workOrders: MaintenanceWorkOrder[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

