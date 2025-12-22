import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VesselType } from '../../../entities/vessel.entity';

export class CreateVesselDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  imoNumber: string;

  @ApiProperty({ enum: VesselType })
  @IsEnum(VesselType)
  vesselType: VesselType;

  @ApiProperty()
  @IsString()
  flag: string;

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
}

