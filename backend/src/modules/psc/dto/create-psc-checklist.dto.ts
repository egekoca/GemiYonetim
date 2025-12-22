import {
  IsString,
  IsDateString,
  IsEnum,
  IsUUID,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PSCStatus } from '../../../entities/psc-checklist.entity';

export class ChecklistItemDto {
  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  item: string;

  @ApiProperty({ enum: ['COMPLIANT', 'NON_COMPLIANT', 'N/A'] })
  @IsEnum(['COMPLIANT', 'NON_COMPLIANT', 'N/A'])
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'N/A';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreatePSCChecklistDto {
  @ApiProperty()
  @IsUUID()
  vesselId: string;

  @ApiProperty()
  @IsDateString()
  inspectionDate: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  port?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  inspector?: string;

  @ApiProperty({ enum: PSCStatus, default: PSCStatus.COMPLIANT, required: false })
  @IsEnum(PSCStatus)
  @IsOptional()
  overallStatus?: PSCStatus;

  @ApiProperty({ type: [ChecklistItemDto], required: false })
  @IsArray()
  @IsOptional()
  checklistItems?: ChecklistItemDto[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  deficiencies?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
}

