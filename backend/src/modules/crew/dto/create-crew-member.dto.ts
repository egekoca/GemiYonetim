import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsInt,
  IsUUID,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CrewPosition, CrewStatus } from '../../../entities/crew-member.entity';

export class CreateCrewMemberDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  seafarerId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  passportNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ enum: CrewPosition })
  @IsEnum(CrewPosition)
  position: CrewPosition;

  @ApiProperty({ enum: CrewStatus, default: CrewStatus.ACTIVE, required: false })
  @IsEnum(CrewStatus)
  @IsOptional()
  status?: CrewStatus;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  joinDate?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  yearsOfExperience?: number;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  vesselId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

