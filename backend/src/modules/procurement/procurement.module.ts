import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcurementService } from './procurement.service';
import { ProcurementController } from './procurement.controller';
import { ProcurementRequest } from '../../entities/procurement-request.entity';
import { ProcurementOrder } from '../../entities/procurement-order.entity';
import { ProcurementSupplier } from '../../entities/procurement-supplier.entity';
import { ProcurementQuote } from '../../entities/procurement-quote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProcurementRequest,
      ProcurementOrder,
      ProcurementSupplier,
      ProcurementQuote,
    ]),
  ],
  controllers: [ProcurementController],
  providers: [ProcurementService],
  exports: [ProcurementService],
})
export class ProcurementModule {}

