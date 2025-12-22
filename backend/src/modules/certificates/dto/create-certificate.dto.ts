import { IsUUID, IsDateString, IsString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCertificateDto {
  @ApiProperty()
  @IsUUID()
  docId: string;

  @ApiProperty()
  @IsDateString()
  issueDate: string;

  @ApiProperty()
  @IsDateString()
  expiryDate: string;

  @ApiProperty({ default: 30, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  warningThreshold?: number;

  @ApiProperty()
  @IsString()
  issuingAuthority: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  certificateNumber?: string;
}

