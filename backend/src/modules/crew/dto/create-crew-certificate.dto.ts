import {
  IsUUID,
  IsEnum,
  IsString,
  IsDateString,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CertificateType } from '../../../entities/crew-certificate.entity';

export class CreateCrewCertificateDto {
  @ApiProperty()
  @IsUUID()
  crewMemberId: string;

  @ApiProperty({ enum: CertificateType })
  @IsEnum(CertificateType)
  certificateType: CertificateType;

  @ApiProperty()
  @IsString()
  certificateNumber: string;

  @ApiProperty()
  @IsDateString()
  issueDate: string;

  @ApiProperty()
  @IsDateString()
  expiryDate: string;

  @ApiProperty()
  @IsString()
  issuingAuthority: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  issuingCountry?: string;

  @ApiProperty({ default: 30, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  warningThreshold?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

