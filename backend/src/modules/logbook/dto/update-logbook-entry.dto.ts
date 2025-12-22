import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateLogbookEntryDto } from './create-logbook-entry.dto';

export class UpdateLogbookEntryDto extends PartialType(CreateLogbookEntryDto) {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isSigned?: boolean;
}

