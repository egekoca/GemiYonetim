import {
  IsUUID,
  IsEnum,
  IsDateString,
  IsNumber,
  IsString,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { QuoteStatus } from '../../../entities/procurement-quote.entity';

export class CreateProcurementQuoteDto {
  @ApiProperty()
  @IsUUID()
  supplierId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  orderId?: string;

  @ApiProperty({ enum: QuoteStatus, default: QuoteStatus.PENDING, required: false })
  @IsEnum(QuoteStatus)
  @IsOptional()
  status?: QuoteStatus;

  @ApiProperty()
  @IsDateString()
  quoteDate: string;

  @ApiProperty()
  @IsDateString()
  validUntil: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({ default: 'USD', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  terms?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

