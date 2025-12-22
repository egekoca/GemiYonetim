import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoyagesService } from './voyages.service';
import { VoyagesController } from './voyages.controller';
import { Voyage } from '../../entities/voyage.entity';
import { PortCall } from '../../entities/port-call.entity';
import { VoyageExpense } from '../../entities/voyage-expense.entity';
import { Port } from '../../entities/port.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Voyage, PortCall, VoyageExpense, Port])],
  controllers: [VoyagesController],
  providers: [VoyagesService],
  exports: [VoyagesService],
})
export class VoyagesModule {}

