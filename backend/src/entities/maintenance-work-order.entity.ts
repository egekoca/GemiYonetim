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
import { MaintenanceTask } from './maintenance-task.entity';
import { MaintenancePart } from './maintenance-part.entity';
import { User } from './user.entity';

export enum WorkOrderStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

@Entity('maintenance_work_orders')
export class MaintenanceWorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workOrderNumber: string;

  @ManyToOne(() => MaintenanceTask, (task) => task.workOrders)
  @JoinColumn({ name: 'task_id' })
  task: MaintenanceTask;

  @Column()
  taskId: string;

  @Column({
    type: 'enum',
    enum: WorkOrderStatus,
    default: WorkOrderStatus.OPEN,
  })
  status: WorkOrderStatus;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  completedDate: Date;

  @Column({ type: 'int', nullable: true })
  actualHours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalCost: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column()
  createdById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: User;

  @Column({ nullable: true })
  assignedToId: string;

  @OneToMany(() => MaintenancePart, (part) => part.workOrder)
  parts: MaintenancePart[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

