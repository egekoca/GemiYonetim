import { IsUUID, IsEnum, IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuditAction } from '../../../entities/audit-log.entity';

export class CreateAuditLogDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: AuditAction })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty()
  @IsString()
  entityType: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  entityId?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userAgent?: string;
}

