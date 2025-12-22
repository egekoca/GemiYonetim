import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voyage, VoyageStatus } from '../../entities/voyage.entity';
import { PortCall } from '../../entities/port-call.entity';
import { VoyageExpense } from '../../entities/voyage-expense.entity';
import { Port } from '../../entities/port.entity';
import { CreateVoyageDto } from './dto/create-voyage.dto';
import { CreatePortCallDto } from './dto/create-port-call.dto';
import { CreateVoyageExpenseDto } from './dto/create-voyage-expense.dto';
import { CreatePortDto } from './dto/create-port.dto';

@Injectable()
export class VoyagesService {
  constructor(
    @InjectRepository(Voyage)
    private voyageRepository: Repository<Voyage>,
    @InjectRepository(PortCall)
    private portCallRepository: Repository<PortCall>,
    @InjectRepository(VoyageExpense)
    private expenseRepository: Repository<VoyageExpense>,
    @InjectRepository(Port)
    private portRepository: Repository<Port>,
  ) {}

  // Voyages
  async createVoyage(createDto: CreateVoyageDto): Promise<Voyage> {
    const voyage = this.voyageRepository.create(createDto);
    // Generate voyage number
    const count = await this.voyageRepository.count();
    voyage.voyageNumber = `VOY-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    return this.voyageRepository.save(voyage);
  }

  async findAllVoyages(vesselId?: string, status?: VoyageStatus): Promise<Voyage[]> {
    const where: any = {};
    if (vesselId) {
      where.vesselId = vesselId;
    }
    if (status) {
      where.status = status;
    }
    return this.voyageRepository.find({
      where,
      relations: ['vessel', 'portCalls', 'portCalls.port', 'expenses'],
      order: { startDate: 'DESC' },
    });
  }

  async findVoyageById(id: string): Promise<Voyage> {
    const voyage = await this.voyageRepository.findOne({
      where: { id },
      relations: ['vessel', 'portCalls', 'portCalls.port', 'expenses'],
    });

    if (!voyage) {
      throw new NotFoundException(`Voyage with ID ${id} not found`);
    }

    return voyage;
  }

  // Port Calls
  async createPortCall(createDto: CreatePortCallDto): Promise<PortCall> {
    const portCall = this.portCallRepository.create(createDto);
    return this.portCallRepository.save(portCall);
  }

  async findAllPortCalls(voyageId?: string): Promise<PortCall[]> {
    const where: any = {};
    if (voyageId) {
      where.voyageId = voyageId;
    }
    return this.portCallRepository.find({
      where,
      relations: ['voyage', 'port'],
      order: { arrivalTime: 'ASC' },
    });
  }

  // Voyage Expenses
  async createExpense(createDto: CreateVoyageExpenseDto): Promise<VoyageExpense> {
    const expense = this.expenseRepository.create(createDto);
    const savedExpense = await this.expenseRepository.save(expense);
    
    // Update voyage total expenses
    const voyage = await this.findVoyageById(createDto.voyageId);
    const totalExpenses = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.voyageId = :voyageId', { voyageId: createDto.voyageId })
      .getRawOne();
    
    voyage.totalExpenses = parseFloat(totalExpenses.total || '0');
    await this.voyageRepository.save(voyage);
    
    return savedExpense;
  }

  async findAllExpenses(voyageId?: string): Promise<VoyageExpense[]> {
    const where: any = {};
    if (voyageId) {
      where.voyageId = voyageId;
    }
    return this.expenseRepository.find({
      where,
      relations: ['voyage'],
      order: { expenseDate: 'DESC' },
    });
  }

  // Ports
  async createPort(createDto: CreatePortDto): Promise<Port> {
    const port = this.portRepository.create(createDto);
    return this.portRepository.save(port);
  }

  async findAllPorts(): Promise<Port[]> {
    return this.portRepository.find({
      relations: ['portCalls'],
      order: { name: 'ASC' },
    });
  }

  async findPortById(id: string): Promise<Port> {
    const port = await this.portRepository.findOne({
      where: { id },
      relations: ['portCalls'],
    });

    if (!port) {
      throw new NotFoundException(`Port with ID ${id} not found`);
    }

    return port;
  }
}

