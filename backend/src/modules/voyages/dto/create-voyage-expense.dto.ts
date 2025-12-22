import { IsUUID, IsEnum, IsString, IsNumber, IsDateString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExpenseType } from '../../../entities/voyage-expense.entity';

export class CreateVoyageExpenseDto {
  @ApiProperty()
  @IsUUID()
  voyageId: string;

  @ApiProperty({ enum: ExpenseType })
  @IsEnum(ExpenseType)
  expenseType: ExpenseType;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ default: 'USD', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty()
  @IsDateString()
  expenseDate: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

