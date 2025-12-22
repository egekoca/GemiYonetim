import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CrewMember } from './crew-member.entity';

export enum TrainingType {
  SAFETY = 'SAFETY',
  FIRE_FIGHTING = 'FIRE_FIGHTING',
  FIRST_AID = 'FIRST_AID',
  SECURITY = 'SECURITY',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  TECHNICAL = 'TECHNICAL',
  LEADERSHIP = 'LEADERSHIP',
  OTHER = 'OTHER',
}

export enum TrainingStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

@Entity('crew_trainings')
export class CrewTraining {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CrewMember, (crewMember) => crewMember.trainings)
  @JoinColumn({ name: 'crew_member_id' })
  crewMember: CrewMember;

  @Column()
  crewMemberId: string;

  @Column()
  trainingName: string;

  @Column({
    type: 'enum',
    enum: TrainingType,
  })
  trainingType: TrainingType;

  @Column({
    type: 'enum',
    enum: TrainingStatus,
    default: TrainingStatus.PLANNED,
  })
  status: TrainingStatus;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'int', nullable: true })
  durationHours: number;

  @Column({ nullable: true })
  certificateNumber: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

