import {
  IsString,
  IsDateString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLogbookEntryDto {
  @ApiProperty()
  @IsUUID()
  vesselId: string;

  @ApiProperty()
  @IsDateString()
  entryDate: string;

  @ApiProperty()
  @IsString()
  entryTime: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  weather?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  seaState?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  windDirection?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  windSpeed?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @Max(50)
  @IsOptional()
  visibility?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  events?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  officerId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  captainId?: string;
}

