import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { FuelConsumption } from '../../entities/fuel-consumption.entity';
import { CreateFuelConsumptionDto } from './dto/create-fuel-consumption.dto';
import { UpdateFuelConsumptionDto } from './dto/update-fuel-consumption.dto';

@Injectable()
export class FuelManagementService {
  constructor(
    @InjectRepository(FuelConsumption)
    private fuelRepository: Repository<FuelConsumption>,
  ) {}

  async create(createDto: CreateFuelConsumptionDto, userId: string): Promise<FuelConsumption> {
    const fuel = this.fuelRepository.create({
      ...createDto,
      operationDate: new Date(createDto.operationDate),
      recordedById: userId,
    });
    return this.fuelRepository.save(fuel);
  }

  async findAll(vesselId?: string, startDate?: string, endDate?: string): Promise<FuelConsumption[]> {
    const where: any = {};
    if (vesselId) {
      where.vesselId = vesselId;
    }
    if (startDate && endDate) {
      where.operationDate = Between(new Date(startDate), new Date(endDate));
    }

    return this.fuelRepository.find({
      where,
      relations: ['vessel', 'recordedBy'],
      order: { operationDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<FuelConsumption> {
    const fuel = await this.fuelRepository.findOne({
      where: { id },
      relations: ['vessel', 'recordedBy'],
    });

    if (!fuel) {
      throw new NotFoundException(`Fuel consumption with ID ${id} not found`);
    }

    return fuel;
  }

  async update(id: string, updateDto: UpdateFuelConsumptionDto): Promise<FuelConsumption> {
    if (updateDto.operationDate) {
      updateDto.operationDate = new Date(updateDto.operationDate) as any;
    }
    await this.fuelRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.fuelRepository.delete(id);
  }
}

