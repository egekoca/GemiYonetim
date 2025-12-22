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
import { Vessel } from './vessel.entity';

export enum RotationType {
  JOINING = 'JOINING',
  SIGN_OFF = 'SIGN_OFF',
  TRANSFER = 'TRANSFER',
  LEAVE = 'LEAVE',
}

@Entity('crew_rotations')
export class CrewRotation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CrewMember, (crewMember) => crewMember.rotations)
  @JoinColumn({ name: 'crew_member_id' })
  crewMember: CrewMember;

  @Column()
  crewMemberId: string;

  @ManyToOne(() => Vessel)
  @JoinColumn({ name: 'vessel_id' })
  vessel: Vessel;

  @Column()
  vesselId: string;

  @Column({
    type: 'enum',
    enum: RotationType,
  })
  rotationType: RotationType;

  @Column({ type: 'date' })
  plannedDate: Date;

  @Column({ type: 'date', nullable: true })
  actualDate: Date;

  @Column({ nullable: true })
  port: string;

  @Column({ nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

