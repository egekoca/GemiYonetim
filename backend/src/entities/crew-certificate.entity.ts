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

export enum CertificateType {
  STCW_BASIC_SAFETY = 'STCW_BASIC_SAFETY',
  STCW_ADVANCED_FIRE = 'STCW_ADVANCED_FIRE',
  STCW_MEDICAL_FIRST_AID = 'STCW_MEDICAL_FIRST_AID',
  STCW_PERSONAL_SURVIVAL = 'STCW_PERSONAL_SURVIVAL',
  STCW_PROFICIENCY_SURVIVAL = 'STCW_PROFICIENCY_SURVIVAL',
  RADIO_OPERATOR = 'RADIO_OPERATOR',
  GMDSS = 'GMDSS',
  TANKER_ENDORSEMENT = 'TANKER_ENDORSEMENT',
  PASSPORT = 'PASSPORT',
  SEAMAN_BOOK = 'SEAMAN_BOOK',
  VISA = 'VISA',
  MEDICAL_CERTIFICATE = 'MEDICAL_CERTIFICATE',
  OTHER = 'OTHER',
}

@Entity('crew_certificates')
export class CrewCertificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CrewMember, (crewMember) => crewMember.certificates)
  @JoinColumn({ name: 'crew_member_id' })
  crewMember: CrewMember;

  @Column()
  crewMemberId: string;

  @Column({
    type: 'enum',
    enum: CertificateType,
  })
  certificateType: CertificateType;

  @Column()
  certificateNumber: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date' })
  expiryDate: Date;

  @Column()
  issuingAuthority: string;

  @Column({ nullable: true })
  issuingCountry: string;

  @Column({ type: 'int', default: 30 })
  warningThreshold: number;

  @Column({ default: false })
  isNotified30: boolean;

  @Column({ default: false })
  isNotified60: boolean;

  @Column({ default: false })
  isNotified90: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

