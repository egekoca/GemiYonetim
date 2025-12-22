import {
  IsUUID,
  IsEnum,
  IsString,
  IsDateString,
  IsInt,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TrainingType, TrainingStatus } from '../../../entities/crew-training.entity';

export class CreateCrewTrainingDto {
  @ApiProperty()
  @IsUUID()
  crewMemberId: string;

  @ApiProperty()
  @IsString()
  trainingName: string;

  @ApiProperty({ enum: TrainingType })
  @IsEnum(TrainingType)
  trainingType: TrainingType;

  @ApiProperty({ enum: TrainingStatus, default: TrainingStatus.PLANNED, required: false })
  @IsEnum(TrainingStatus)
  @IsOptional()
  status?: TrainingStatus;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  durationHours?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  certificateNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

