import {
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
  IsUUID,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VoyageStatus } from '../../../entities/voyage.entity';

export class CreateVoyageDto {
  @ApiProperty()
  @IsUUID()
  vesselId: string;

  @ApiProperty({ enum: VoyageStatus, default: VoyageStatus.PLANNED, required: false })
  @IsEnum(VoyageStatus)
  @IsOptional()
  status?: VoyageStatus;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  originPort?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  destinationPort?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  distance?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  fuelConsumed?: number;
}

