import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SafetyDrill } from '../../entities/safety-drill.entity';
import { CreateSafetyDrillDto } from './dto/create-safety-drill.dto';
import { UpdateSafetyDrillDto } from './dto/update-safety-drill.dto';

@Injectable()
export class SafetyService {
  constructor(
    @InjectRepository(SafetyDrill)
    private safetyRepository: Repository<SafetyDrill>,
  ) {}

  async create(createDto: CreateSafetyDrillDto, userId: string): Promise<SafetyDrill> {
    const drill = this.safetyRepository.create({
      ...createDto,
      plannedDate: new Date(createDto.plannedDate),
      actualDate: createDto.actualDate ? new Date(createDto.actualDate) : null,
      conductedById: userId,
    });
    return this.safetyRepository.save(drill);
  }

  async findAll(vesselId?: string): Promise<SafetyDrill[]> {
    const where: any = {};
    if (vesselId) {
      where.vesselId = vesselId;
    }

    return this.safetyRepository.find({
      where,
      relations: ['vessel', 'conductedBy'],
      order: { plannedDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<SafetyDrill> {
    const drill = await this.safetyRepository.findOne({
      where: { id },
      relations: ['vessel', 'conductedBy'],
    });

    if (!drill) {
      throw new NotFoundException(`Safety drill with ID ${id} not found`);
    }

    return drill;
  }

  async update(id: string, updateDto: UpdateSafetyDrillDto): Promise<SafetyDrill> {
    if (updateDto.plannedDate) {
      updateDto.plannedDate = new Date(updateDto.plannedDate) as any;
    }
    if (updateDto.actualDate) {
      updateDto.actualDate = new Date(updateDto.actualDate) as any;
    }
    await this.safetyRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.safetyRepository.delete(id);
  }
}

