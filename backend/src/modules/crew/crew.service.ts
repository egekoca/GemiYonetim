import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, Between } from 'typeorm';
import { CrewMember } from '../../entities/crew-member.entity';
import { CrewCertificate } from '../../entities/crew-certificate.entity';
import { CrewTraining } from '../../entities/crew-training.entity';
import { CrewRotation } from '../../entities/crew-rotation.entity';
import { CreateCrewMemberDto } from './dto/create-crew-member.dto';
import { UpdateCrewMemberDto } from './dto/update-crew-member.dto';
import { CreateCrewCertificateDto } from './dto/create-crew-certificate.dto';
import { CreateCrewTrainingDto } from './dto/create-crew-training.dto';
import { CreateCrewRotationDto } from './dto/create-crew-rotation.dto';

@Injectable()
export class CrewService {
  constructor(
    @InjectRepository(CrewMember)
    private crewMemberRepository: Repository<CrewMember>,
    @InjectRepository(CrewCertificate)
    private crewCertificateRepository: Repository<CrewCertificate>,
    @InjectRepository(CrewTraining)
    private crewTrainingRepository: Repository<CrewTraining>,
    @InjectRepository(CrewRotation)
    private crewRotationRepository: Repository<CrewRotation>,
  ) {}

  // Crew Members
  async createCrewMember(createDto: CreateCrewMemberDto): Promise<CrewMember> {
    const crewMember = this.crewMemberRepository.create(createDto);
    return this.crewMemberRepository.save(crewMember);
  }

  async findAllCrewMembers(vesselId?: string): Promise<CrewMember[]> {
    const where: any = {};
    if (vesselId) {
      where.vesselId = vesselId;
    }
    return this.crewMemberRepository.find({
      where,
      relations: ['vessel', 'certificates', 'trainings', 'rotations'],
      order: { createdAt: 'DESC' },
    });
  }

  async findCrewMemberById(id: string): Promise<CrewMember> {
    const crewMember = await this.crewMemberRepository.findOne({
      where: { id },
      relations: ['vessel', 'certificates', 'trainings', 'rotations'],
    });

    if (!crewMember) {
      throw new NotFoundException(`Crew member with ID ${id} not found`);
    }

    return crewMember;
  }

  async updateCrewMember(id: string, updateDto: UpdateCrewMemberDto): Promise<CrewMember> {
    await this.crewMemberRepository.update(id, updateDto);
    return this.findCrewMemberById(id);
  }

  async removeCrewMember(id: string): Promise<void> {
    await this.crewMemberRepository.delete(id);
  }

  // Crew Certificates
  async createCertificate(createDto: CreateCrewCertificateDto): Promise<CrewCertificate> {
    const certificate = this.crewCertificateRepository.create(createDto);
    return this.crewCertificateRepository.save(certificate);
  }

  async findExpiringCertificates(days: number = 30): Promise<CrewCertificate[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return this.crewCertificateRepository.find({
      where: {
        expiryDate: Between(today, futureDate),
      },
      relations: ['crewMember'],
    });
  }

  async findExpiredCertificates(): Promise<CrewCertificate[]> {
    const today = new Date();
    return this.crewCertificateRepository.find({
      where: {
        expiryDate: LessThanOrEqual(today),
      },
      relations: ['crewMember'],
    });
  }

  // Crew Trainings
  async createTraining(createDto: CreateCrewTrainingDto): Promise<CrewTraining> {
    const training = this.crewTrainingRepository.create(createDto);
    return this.crewTrainingRepository.save(training);
  }

  async findAllTrainings(crewMemberId?: string): Promise<CrewTraining[]> {
    const where: any = {};
    if (crewMemberId) {
      where.crewMemberId = crewMemberId;
    }
    return this.crewTrainingRepository.find({
      where,
      relations: ['crewMember'],
      order: { startDate: 'DESC' },
    });
  }

  // Crew Rotations
  async createRotation(createDto: CreateCrewRotationDto): Promise<CrewRotation> {
    const rotation = this.crewRotationRepository.create(createDto);
    return this.crewRotationRepository.save(rotation);
  }

  async findAllRotations(crewMemberId?: string, vesselId?: string): Promise<CrewRotation[]> {
    const where: any = {};
    if (crewMemberId) {
      where.crewMemberId = crewMemberId;
    }
    if (vesselId) {
      where.vesselId = vesselId;
    }
    return this.crewRotationRepository.find({
      where,
      relations: ['crewMember', 'vessel'],
      order: { plannedDate: 'DESC' },
    });
  }
}

