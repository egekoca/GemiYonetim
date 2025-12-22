import {
  IsString,
  IsDateString,
  IsEnum,
  IsUUID,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DrillType, DrillStatus } from '../../../entities/safety-drill.entity';

export class CreateSafetyDrillDto {
  @ApiProperty()
  @IsUUID()
  vesselId: string;

  @ApiProperty({ enum: DrillType })
  @IsEnum(DrillType)
  drillType: DrillType;

  @ApiProperty({ enum: DrillStatus, default: DrillStatus.PLANNED, required: false })
  @IsEnum(DrillStatus)
  @IsOptional()
  status?: DrillStatus;

  @ApiProperty()
  @IsDateString()
  plannedDate: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  actualDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  endTime?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  durationMinutes?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  participants?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  observations?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  improvements?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
}

