import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SafetyDrill } from '../../entities/safety-drill.entity';
import { SafetyService } from './safety.service';
import { SafetyController } from './safety.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SafetyDrill])],
  controllers: [SafetyController],
  providers: [SafetyService],
  exports: [SafetyService],
})
export class SafetyModule {}

