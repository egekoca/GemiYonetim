import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from '../../entities/incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
  ) {}

  async create(createDto: CreateIncidentDto, userId: string): Promise<Incident> {
    const incident = this.incidentRepository.create({
      ...createDto,
      incidentDate: new Date(createDto.incidentDate),
      reportedById: userId,
    });
    return this.incidentRepository.save(incident);
  }

  async findAll(vesselId?: string): Promise<Incident[]> {
    const where: any = {};
    if (vesselId) {
      where.vesselId = vesselId;
    }

    return this.incidentRepository.find({
      where,
      relations: ['vessel', 'reportedBy', 'investigatedBy'],
      order: { incidentDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Incident> {
    const incident = await this.incidentRepository.findOne({
      where: { id },
      relations: ['vessel', 'reportedBy', 'investigatedBy'],
    });

    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }

    return incident;
  }

  async update(id: string, updateDto: UpdateIncidentDto): Promise<Incident> {
    if (updateDto.incidentDate) {
      updateDto.incidentDate = new Date(updateDto.incidentDate) as any;
    }
    await this.incidentRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.incidentRepository.delete(id);
  }
}

