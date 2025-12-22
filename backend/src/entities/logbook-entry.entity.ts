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

@Entity('logbook_entries')
export class LogbookEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vessel)
  @JoinColumn({ name: 'vessel_id' })
  vessel: Vessel;

  @Column()
  vesselId: string;

  @Column({ type: 'date' })
  entryDate: Date;

  @Column({ type: 'time' })
  entryTime: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ nullable: true })
  weather: string;

  @Column({ nullable: true })
  seaState: string;

  @Column({ nullable: true })
  windDirection: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  windSpeed: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  visibility: number;

  @Column({ type: 'text', nullable: true })
  events: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'officer_id' })
  officer: User;

  @Column({ nullable: true })
  officerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'captain_id' })
  captain: User;

  @Column({ nullable: true })
  captainId: string;

  @Column({ type: 'boolean', default: false })
  isSigned: boolean;

  @Column({ type: 'timestamp', nullable: true })
  signedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

