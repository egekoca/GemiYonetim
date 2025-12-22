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
import { OrderStatus } from '../../../entities/procurement-order.entity';

export class CreateProcurementOrderDto {
  @ApiProperty()
  @IsUUID()
  requestId: string;

  @ApiProperty()
  @IsUUID()
  supplierId: string;

  @ApiProperty({ enum: OrderStatus, default: OrderStatus.DRAFT, required: false })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty()
  @IsDateString()
  orderDate: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  expectedDeliveryDate?: string;

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

  @ApiProperty()
  @IsUUID()
  createdById: string;
}

