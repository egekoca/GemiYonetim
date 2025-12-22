import { IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsUUID()
  vesselId: string;

  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

