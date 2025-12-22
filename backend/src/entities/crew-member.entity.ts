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
import { CrewCertificate } from './crew-certificate.entity';
import { CrewTraining } from './crew-training.entity';
import { CrewRotation } from './crew-rotation.entity';

export enum CrewPosition {
  CAPTAIN = 'CAPTAIN',
  CHIEF_OFFICER = 'CHIEF_OFFICER',
  SECOND_OFFICER = 'SECOND_OFFICER',
  THIRD_OFFICER = 'THIRD_OFFICER',
  CHIEF_ENGINEER = 'CHIEF_ENGINEER',
  SECOND_ENGINEER = 'SECOND_ENGINEER',
  THIRD_ENGINEER = 'THIRD_ENGINEER',
  FOURTH_ENGINEER = 'FOURTH_ENGINEER',
  ELECTRICIAN = 'ELECTRICIAN',
  BOSUN = 'BOSUN',
  ABLE_SEAMAN = 'ABLE_SEAMAN',
  ORDINARY_SEAMAN = 'ORDINARY_SEAMAN',
  COOK = 'COOK',
  STEWARD = 'STEWARD',
  CADET = 'CADET',
  OTHER = 'OTHER',
}

export enum CrewStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  INACTIVE = 'INACTIVE',
}

@Entity('crew_members')
export class CrewMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ unique: true, nullable: true })
  seafarerId: string;

  @Column({ nullable: true })
  passportNumber: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({
    type: 'enum',
    enum: CrewPosition,
  })
  position: CrewPosition;

  @Column({
    type: 'enum',
    enum: CrewStatus,
    default: CrewStatus.ACTIVE,
  })
  status: CrewStatus;

  @Column({ type: 'date', nullable: true })
  joinDate: Date;

  @Column({ type: 'int', nullable: true })
  yearsOfExperience: number;

  @ManyToOne(() => Vessel, (vessel) => vessel.crewMembers)
  @JoinColumn({ name: 'vessel_id' })
  vessel: Vessel;

  @Column({ nullable: true })
  vesselId: string;

  @OneToMany(() => CrewCertificate, (certificate) => certificate.crewMember)
  certificates: CrewCertificate[];

  @OneToMany(() => CrewTraining, (training) => training.crewMember)
  trainings: CrewTraining[];

  @OneToMany(() => CrewRotation, (rotation) => rotation.crewMember)
  rotations: CrewRotation[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

