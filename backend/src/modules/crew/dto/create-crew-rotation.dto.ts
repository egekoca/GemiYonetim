import { IsUUID, IsEnum, IsDateString, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RotationType } from '../../../entities/crew-rotation.entity';

export class CreateCrewRotationDto {
  @ApiProperty()
  @IsUUID()
  crewMemberId: string;

  @ApiProperty()
  @IsUUID()
  vesselId: string;

  @ApiProperty({ enum: RotationType })
  @IsEnum(RotationType)
  rotationType: RotationType;

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
  port?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

