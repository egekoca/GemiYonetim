import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PSCChecklist } from '../../entities/psc-checklist.entity';
import { CreatePSCChecklistDto } from './dto/create-psc-checklist.dto';
import { UpdatePSCChecklistDto } from './dto/update-psc-checklist.dto';

@Injectable()
export class PSCService {
  constructor(
    @InjectRepository(PSCChecklist)
    private pscRepository: Repository<PSCChecklist>,
  ) {}

  async create(createDto: CreatePSCChecklistDto, userId: string): Promise<PSCChecklist> {
    const psc = this.pscRepository.create({
      ...createDto,
      inspectionDate: new Date(createDto.inspectionDate),
      preparedById: userId,
    });
    return this.pscRepository.save(psc);
  }

  async findAll(vesselId?: string): Promise<PSCChecklist[]> {
    const where: any = {};
    if (vesselId) {
      where.vesselId = vesselId;
    }

    return this.pscRepository.find({
      where,
      relations: ['vessel', 'preparedBy'],
      order: { inspectionDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PSCChecklist> {
    const psc = await this.pscRepository.findOne({
      where: { id },
      relations: ['vessel', 'preparedBy'],
    });

    if (!psc) {
      throw new NotFoundException(`PSC checklist with ID ${id} not found`);
    }

    return psc;
  }

  async update(id: string, updateDto: UpdatePSCChecklistDto): Promise<PSCChecklist> {
    if (updateDto.inspectionDate) {
      updateDto.inspectionDate = new Date(updateDto.inspectionDate) as any;
    }
    await this.pscRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.pscRepository.delete(id);
  }
}

