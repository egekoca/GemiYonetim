import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceTask } from '../../entities/maintenance-task.entity';
import { MaintenanceSchedule } from '../../entities/maintenance-schedule.entity';
import { MaintenanceWorkOrder } from '../../entities/maintenance-work-order.entity';
import { MaintenancePart } from '../../entities/maintenance-part.entity';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MaintenanceTask,
      MaintenanceSchedule,
      MaintenanceWorkOrder,
      MaintenancePart,
    ]),
    InventoryModule,
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}

