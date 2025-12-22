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
import { RequestStatus } from '../../../entities/procurement-request.entity';

export class CreateProcurementRequestDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: RequestStatus, default: RequestStatus.DRAFT, required: false })
  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;

  @ApiProperty()
  @IsDateString()
  requiredDate: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  estimatedCost?: number;

  @ApiProperty()
  @IsUUID()
  vesselId: string;

  @ApiProperty()
  @IsUUID()
  requestedById: string;
}

