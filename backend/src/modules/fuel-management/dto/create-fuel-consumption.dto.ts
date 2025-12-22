import {
  IsString,
  IsDateString,
  IsNumber,
  IsUUID,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FuelOperationType } from '../../../entities/fuel-consumption.entity';

export class CreateFuelConsumptionDto {
  @ApiProperty()
  @IsUUID()
  vesselId: string;

  @ApiProperty({ enum: FuelOperationType })
  @IsEnum(FuelOperationType)
  operationType: FuelOperationType;

  @ApiProperty()
  @IsDateString()
  operationDate: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  unitPrice?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalCost?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tank?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  tankLevelBefore?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  tankLevelAfter?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  supplier?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  port?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  qualityTest?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
}

