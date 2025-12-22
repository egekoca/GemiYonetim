import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelConsumption } from '../../entities/fuel-consumption.entity';
import { FuelManagementService } from './fuel-management.service';
import { FuelManagementController } from './fuel-management.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FuelConsumption])],
  controllers: [FuelManagementController],
  providers: [FuelManagementService],
  exports: [FuelManagementService],
})
export class FuelManagementModule {}

