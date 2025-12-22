import {
  IsString,
  IsEnum,
  IsDateString,
  IsUUID,
  IsInt,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../../../entities/maintenance-task.entity';

export class CreateMaintenanceTaskDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsUUID()
  vesselId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  scheduleId?: string;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.PENDING, required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ enum: TaskPriority, default: TaskPriority.MEDIUM, required: false })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty()
  @IsDateString()
  dueDate: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  equipment?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  assignedToId?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  estimatedHours?: number;
}

