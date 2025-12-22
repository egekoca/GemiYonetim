import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VesselsService } from './vessels.service';
import { VesselsController } from './vessels.controller';
import { Vessel } from '../../entities/vessel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vessel])],
  controllers: [VesselsController],
  providers: [VesselsService],
  exports: [VesselsService],
})
export class VesselsModule {}

