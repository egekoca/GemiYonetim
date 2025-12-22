import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { LogbookEntry } from '../../entities/logbook-entry.entity';
import { CreateLogbookEntryDto } from './dto/create-logbook-entry.dto';
import { UpdateLogbookEntryDto } from './dto/update-logbook-entry.dto';

@Injectable()
export class LogbookService {
  constructor(
    @InjectRepository(LogbookEntry)
    private logbookRepository: Repository<LogbookEntry>,
  ) {}

  async create(createDto: CreateLogbookEntryDto): Promise<LogbookEntry> {
    const entry = this.logbookRepository.create({
      ...createDto,
      entryDate: new Date(createDto.entryDate),
    });
    return this.logbookRepository.save(entry);
  }

  async findAll(vesselId?: string, startDate?: string, endDate?: string): Promise<LogbookEntry[]> {
    const where: any = {};
    if (vesselId) {
      where.vesselId = vesselId;
    }
    if (startDate && endDate) {
      where.entryDate = Between(new Date(startDate), new Date(endDate));
    }

    return this.logbookRepository.find({
      where,
      relations: ['vessel', 'officer', 'captain'],
      order: { entryDate: 'DESC', entryTime: 'DESC' },
    });
  }

  async findOne(id: string): Promise<LogbookEntry> {
    const entry = await this.logbookRepository.findOne({
      where: { id },
      relations: ['vessel', 'officer', 'captain'],
    });

    if (!entry) {
      throw new NotFoundException(`Logbook entry with ID ${id} not found`);
    }

    return entry;
  }

  async update(id: string, updateDto: UpdateLogbookEntryDto): Promise<LogbookEntry> {
    if (updateDto.entryDate) {
      updateDto.entryDate = new Date(updateDto.entryDate) as any;
    }
    await this.logbookRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.logbookRepository.delete(id);
  }

  async sign(id: string, captainId: string): Promise<LogbookEntry> {
    const entry = await this.findOne(id);
    entry.isSigned = true;
    entry.captainId = captainId;
    entry.signedAt = new Date();
    return this.logbookRepository.save(entry);
  }
}

