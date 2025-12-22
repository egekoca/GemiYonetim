import {
  IsString,
  IsDateString,
  IsEnum,
  IsUUID,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IncidentType, IncidentSeverity, IncidentStatus } from '../../../entities/incident.entity';

export class CreateIncidentDto {
  @ApiProperty()
  @IsUUID()
  vesselId: string;

  @ApiProperty({ enum: IncidentType })
  @IsEnum(IncidentType)
  incidentType: IncidentType;

  @ApiProperty({ enum: IncidentSeverity, default: IncidentSeverity.MEDIUM, required: false })
  @IsEnum(IncidentSeverity)
  @IsOptional()
  severity?: IncidentSeverity;

  @ApiProperty({ enum: IncidentStatus, default: IncidentStatus.REPORTED, required: false })
  @IsEnum(IncidentStatus)
  @IsOptional()
  status?: IncidentStatus;

  @ApiProperty()
  @IsDateString()
  incidentDate: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  immediateActions?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  investigation?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  rootCause?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  correctiveActions?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  preventiveActions?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  photos?: string;
}

