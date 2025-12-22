import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vessel } from '../../entities/vessel.entity';
import { CreateVesselDto } from './dto/create-vessel.dto';
import { UpdateVesselDto } from './dto/update-vessel.dto';

@Injectable()
export class VesselsService {
  constructor(
    @InjectRepository(Vessel)
    private vesselsRepository: Repository<Vessel>,
  ) {}

  async create(createVesselDto: CreateVesselDto): Promise<Vessel> {
    const vessel = this.vesselsRepository.create(createVesselDto);
    return this.vesselsRepository.save(vessel);
  }

  async findAll(): Promise<Vessel[]> {
    return this.vesselsRepository.find({
      relations: ['documents'],
    });
  }

  async findOne(id: string): Promise<Vessel> {
    const vessel = await this.vesselsRepository.findOne({
      where: { id },
      relations: ['documents', 'syncQueues'],
    });

    if (!vessel) {
      throw new NotFoundException(`Vessel with ID ${id} not found`);
    }

    return vessel;
  }

  async update(id: string, updateVesselDto: UpdateVesselDto): Promise<Vessel> {
    await this.vesselsRepository.update(id, updateVesselDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.vesselsRepository.delete(id);
  }
}

