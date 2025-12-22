import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PSCChecklist } from '../../entities/psc-checklist.entity';
import { PSCService } from './psc.service';
import { PSCController } from './psc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PSCChecklist])],
  controllers: [PSCController],
  providers: [PSCService],
  exports: [PSCService],
})
export class PSCModule {}

