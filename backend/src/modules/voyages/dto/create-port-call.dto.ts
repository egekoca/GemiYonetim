import { IsUUID, IsEnum, IsTimestamp, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PortCallType } from '../../../entities/port-call.entity';

export class CreatePortCallDto {
  @ApiProperty()
  @IsUUID()
  voyageId: string;

  @ApiProperty()
  @IsUUID()
  portId: string;

  @ApiProperty({ enum: PortCallType })
  @IsEnum(PortCallType)
  callType: PortCallType;

  @ApiProperty()
  @IsString()
  arrivalTime: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  departureTime?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  portCharges?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

