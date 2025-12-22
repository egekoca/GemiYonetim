import { IsString, IsEnum, IsInt, IsDateString, IsUUID, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ScheduleFrequency } from '../../../entities/maintenance-schedule.entity';

export class CreateMaintenanceScheduleDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsUUID()
  vesselId: string;

  @ApiProperty({ enum: ScheduleFrequency })
  @IsEnum(ScheduleFrequency)
  frequency: ScheduleFrequency;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  intervalValue?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

