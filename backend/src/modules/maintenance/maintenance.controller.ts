import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceTaskDto } from './dto/create-maintenance-task.dto';
import { CreateMaintenanceScheduleDto } from './dto/create-maintenance-schedule.dto';
import { CreateMaintenanceWorkOrderDto } from './dto/create-maintenance-work-order.dto';
import { CreateMaintenancePartDto } from './dto/create-maintenance-part.dto';
import { TaskStatus, WorkOrderStatus } from '../../entities/maintenance-task.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Maintenance')
@Controller('maintenance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  // Tasks
  @Post('tasks')
  @ApiOperation({ summary: 'Create a new maintenance task' })
  createTask(@Body() createDto: CreateMaintenanceTaskDto) {
    return this.maintenanceService.createTask(createDto);
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Get all maintenance tasks' })
  findAllTasks(@Query('vesselId') vesselId?: string, @Query('status') status?: string) {
    return this.maintenanceService.findAllTasks(vesselId, status as TaskStatus);
  }

  @Get('tasks/overdue')
  @ApiOperation({ summary: 'Get overdue maintenance tasks' })
  findOverdueTasks(@Query('vesselId') vesselId?: string) {
    return this.maintenanceService.findOverdueTasks(vesselId);
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Get maintenance task by ID' })
  findTaskById(@Param('id') id: string) {
    return this.maintenanceService.findTaskById(id);
  }

  @Put('tasks/:id/status')
  @ApiOperation({ summary: 'Update maintenance task status' })
  updateTaskStatus(@Param('id') id: string, @Body('status') status: TaskStatus) {
    return this.maintenanceService.updateTaskStatus(id, status);
  }

  // Schedules
  @Post('schedules')
  @ApiOperation({ summary: 'Create a new maintenance schedule' })
  createSchedule(@Body() createDto: CreateMaintenanceScheduleDto) {
    return this.maintenanceService.createSchedule(createDto);
  }

  @Get('schedules')
  @ApiOperation({ summary: 'Get all maintenance schedules' })
  findAllSchedules(@Query('vesselId') vesselId?: string) {
    return this.maintenanceService.findAllSchedules(vesselId);
  }

  // Work Orders
  @Post('work-orders')
  @ApiOperation({ summary: 'Create a new work order' })
  createWorkOrder(@Body() createDto: CreateMaintenanceWorkOrderDto) {
    return this.maintenanceService.createWorkOrder(createDto);
  }

  @Get('work-orders')
  @ApiOperation({ summary: 'Get all work orders' })
  findAllWorkOrders(@Query('vesselId') vesselId?: string, @Query('status') status?: string) {
    return this.maintenanceService.findAllWorkOrders(vesselId, status as WorkOrderStatus);
  }

  @Get('work-orders/:id')
  @ApiOperation({ summary: 'Get work order by ID' })
  findWorkOrderById(@Param('id') id: string) {
    return this.maintenanceService.findWorkOrderById(id);
  }

  // Parts
  @Post('parts')
  @ApiOperation({ summary: 'Add part to work order' })
  addPart(@Body() createDto: CreateMaintenancePartDto) {
    return this.maintenanceService.addPart(createDto);
  }
}

