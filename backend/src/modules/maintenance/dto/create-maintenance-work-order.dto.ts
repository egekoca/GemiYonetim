import {
  IsUUID,
  IsEnum,
  IsDateString,
  IsInt,
  IsNumber,
  IsString,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WorkOrderStatus } from '../../../entities/maintenance-work-order.entity';

export class CreateMaintenanceWorkOrderDto {
  @ApiProperty()
  @IsUUID()
  taskId: string;

  @ApiProperty({ enum: WorkOrderStatus, default: WorkOrderStatus.OPEN, required: false })
  @IsEnum(WorkOrderStatus)
  @IsOptional()
  status?: WorkOrderStatus;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  actualHours?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalCost?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty()
  @IsUUID()
  createdById: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  assignedToId?: string;
}

