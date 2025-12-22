import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { MaintenanceTask, TaskStatus } from '../../entities/maintenance-task.entity';
import { MaintenanceSchedule } from '../../entities/maintenance-schedule.entity';
import { MaintenanceWorkOrder, WorkOrderStatus } from '../../entities/maintenance-work-order.entity';
import { MaintenancePart } from '../../entities/maintenance-part.entity';
import { CreateMaintenanceTaskDto } from './dto/create-maintenance-task.dto';
import { CreateMaintenanceScheduleDto } from './dto/create-maintenance-schedule.dto';
import { CreateMaintenanceWorkOrderDto } from './dto/create-maintenance-work-order.dto';
import { CreateMaintenancePartDto } from './dto/create-maintenance-part.dto';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(MaintenanceTask)
    private taskRepository: Repository<MaintenanceTask>,
    @InjectRepository(MaintenanceSchedule)
    private scheduleRepository: Repository<MaintenanceSchedule>,
    @InjectRepository(MaintenanceWorkOrder)
    private workOrderRepository: Repository<MaintenanceWorkOrder>,
    @InjectRepository(MaintenancePart)
    private partRepository: Repository<MaintenancePart>,
  ) {}

  // Maintenance Tasks
  async createTask(createDto: CreateMaintenanceTaskDto): Promise<MaintenanceTask> {
    const task = this.taskRepository.create(createDto);
    return this.taskRepository.save(task);
  }

  async findAllTasks(vesselId?: string, status?: TaskStatus): Promise<MaintenanceTask[]> {
    const where: any = {};
    if (vesselId) {
      where.vesselId = vesselId;
    }
    if (status) {
      where.status = status;
    }
    return this.taskRepository.find({
      where,
      relations: ['vessel', 'schedule', 'assignedTo', 'workOrders'],
      order: { dueDate: 'ASC' },
    });
  }

  async findTaskById(id: string): Promise<MaintenanceTask> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['vessel', 'schedule', 'assignedTo', 'workOrders'],
    });

    if (!task) {
      throw new NotFoundException(`Maintenance task with ID ${id} not found`);
    }

    return task;
  }

  async findOverdueTasks(vesselId?: string): Promise<MaintenanceTask[]> {
    const today = new Date();
    const where: any = {
      dueDate: LessThanOrEqual(today),
      status: TaskStatus.PENDING,
    };
    if (vesselId) {
      where.vesselId = vesselId;
    }
    return this.taskRepository.find({
      where,
      relations: ['vessel', 'schedule'],
      order: { dueDate: 'ASC' },
    });
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<MaintenanceTask> {
    const task = await this.findTaskById(id);
    task.status = status;
    if (status === TaskStatus.COMPLETED) {
      task.completedDate = new Date();
    }
    return this.taskRepository.save(task);
  }

  // Maintenance Schedules
  async createSchedule(createDto: CreateMaintenanceScheduleDto): Promise<MaintenanceSchedule> {
    const schedule = this.scheduleRepository.create(createDto);
    return this.scheduleRepository.save(schedule);
  }

  async findAllSchedules(vesselId?: string): Promise<MaintenanceSchedule[]> {
    const where: any = { isActive: true };
    if (vesselId) {
      where.vesselId = vesselId;
    }
    return this.scheduleRepository.find({
      where,
      relations: ['vessel', 'tasks'],
      order: { name: 'ASC' },
    });
  }

  // Work Orders
  async createWorkOrder(createDto: CreateMaintenanceWorkOrderDto): Promise<MaintenanceWorkOrder> {
    const workOrder = this.workOrderRepository.create(createDto);
    // Generate work order number
    const count = await this.workOrderRepository.count();
    workOrder.workOrderNumber = `WO-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    return this.workOrderRepository.save(workOrder);
  }

  async findAllWorkOrders(vesselId?: string, status?: WorkOrderStatus): Promise<MaintenanceWorkOrder[]> {
    const query = this.workOrderRepository
      .createQueryBuilder('workOrder')
      .leftJoinAndSelect('workOrder.task', 'task')
      .leftJoinAndSelect('workOrder.createdBy', 'createdBy')
      .leftJoinAndSelect('workOrder.assignedTo', 'assignedTo')
      .leftJoinAndSelect('workOrder.parts', 'parts')
      .orderBy('workOrder.createdAt', 'DESC');

    if (vesselId) {
      query.where('task.vesselId = :vesselId', { vesselId });
    }
    if (status) {
      query.andWhere('workOrder.status = :status', { status });
    }

    return query.getMany();
  }

  async findWorkOrderById(id: string): Promise<MaintenanceWorkOrder> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id },
      relations: ['task', 'createdBy', 'assignedTo', 'parts', 'parts.inventoryItem'],
    });

    if (!workOrder) {
      throw new NotFoundException(`Work order with ID ${id} not found`);
    }

    return workOrder;
  }

  // Maintenance Parts
  async addPart(createDto: CreateMaintenancePartDto): Promise<MaintenancePart> {
    const part = this.partRepository.create(createDto);
    return this.partRepository.save(part);
  }
}

