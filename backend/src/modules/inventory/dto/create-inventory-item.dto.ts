import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsUUID,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InventoryUnit } from '../../../entities/inventory-item.entity';

export class CreateInventoryItemDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  partNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({ enum: InventoryUnit, default: InventoryUnit.PIECE, required: false })
  @IsEnum(InventoryUnit)
  @IsOptional()
  unit?: InventoryUnit;

  @ApiProperty({ default: 0, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minimumQuantity?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maximumQuantity?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  unitPrice?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty()
  @IsUUID()
  vesselId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  locationId?: string;
}

