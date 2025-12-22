import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngineLog } from '../../entities/engine-log.entity';
import { EngineLogService } from './engine-log.service';
import { EngineLogController } from './engine-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EngineLog])],
  controllers: [EngineLogController],
  providers: [EngineLogService],
  exports: [EngineLogService],
})
export class EngineLogModule {}

