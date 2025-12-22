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

export enum DrillType {
  FIRE = 'FIRE',
  ABANDON_SHIP = 'ABANDON_SHIP',
  MAN_OVERBOARD = 'MAN_OVERBOARD',
  EMERGENCY = 'EMERGENCY',
  OTHER = 'OTHER',
}

export enum DrillStatus {
  PLANNED = 'PLANNED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('safety_drills')
export class SafetyDrill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vessel)
  @JoinColumn({ name: 'vessel_id' })
  vessel: Vessel;

  @Column()
  vesselId: string;

  @Column({
    type: 'enum',
    enum: DrillType,
  })
  drillType: DrillType;

  @Column({
    type: 'enum',
    enum: DrillStatus,
    default: DrillStatus.PLANNED,
  })
  status: DrillStatus;

  @Column({ type: 'date' })
  plannedDate: Date;

  @Column({ type: 'date', nullable: true })
  actualDate: Date;

  @Column({ type: 'time', nullable: true })
  startTime: string;

  @Column({ type: 'time', nullable: true })
  endTime: string;

  @Column({ type: 'int', nullable: true })
  durationMinutes: number;

  @Column({ type: 'text', nullable: true })
  participants: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'text', nullable: true })
  improvements: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'conducted_by' })
  conductedBy: User;

  @Column({ nullable: true })
  conductedById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

