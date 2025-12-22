import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { EngineLog } from '../../entities/engine-log.entity';
import { CreateEngineLogDto } from './dto/create-engine-log.dto';
import { UpdateEngineLogDto } from './dto/update-engine-log.dto';

@Injectable()
export class EngineLogService {
  constructor(
    @InjectRepository(EngineLog)
    private engineLogRepository: Repository<EngineLog>,
  ) {}

  async create(createDto: CreateEngineLogDto): Promise<EngineLog> {
    const log = this.engineLogRepository.create({
      ...createDto,
      logDate: new Date(createDto.logDate),
    });
    return this.engineLogRepository.save(log);
  }

  async findAll(vesselId?: string, startDate?: string, endDate?: string): Promise<EngineLog[]> {
    const where: any = {};
    if (vesselId) {
      where.vesselId = vesselId;
    }
    if (startDate && endDate) {
      where.logDate = Between(new Date(startDate), new Date(endDate));
    }

    return this.engineLogRepository.find({
      where,
      relations: ['vessel', 'engineer'],
      order: { logDate: 'DESC', logTime: 'DESC' },
    });
  }

  async findOne(id: string): Promise<EngineLog> {
    const log = await this.engineLogRepository.findOne({
      where: { id },
      relations: ['vessel', 'engineer'],
    });

    if (!log) {
      throw new NotFoundException(`Engine log with ID ${id} not found`);
    }

    return log;
  }

  async update(id: string, updateDto: UpdateEngineLogDto): Promise<EngineLog> {
    if (updateDto.logDate) {
      updateDto.logDate = new Date(updateDto.logDate) as any;
    }
    await this.engineLogRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.engineLogRepository.delete(id);
  }
}

