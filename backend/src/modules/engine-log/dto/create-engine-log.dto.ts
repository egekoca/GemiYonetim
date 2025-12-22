import {
  IsString,
  IsDateString,
  IsNumber,
  IsUUID,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEngineLogDto {
  @ApiProperty()
  @IsUUID()
  vesselId: string;

  @ApiProperty()
  @IsDateString()
  logDate: string;

  @ApiProperty()
  @IsString()
  logTime: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  engineHours?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  rpm?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  fuelLevel?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  oilPressure?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  waterTemperature?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  exhaustTemperature?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  oilTemperature?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  loadPercentage?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  alarms?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  maintenanceNotes?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  engineerId?: string;
}

