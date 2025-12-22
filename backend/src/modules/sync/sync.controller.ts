import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SyncAction } from '../../entities/sync-queue.entity';

@ApiTags('Sync')
@Controller('sync')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('queue')
  @ApiOperation({ summary: 'Create a sync task' })
  async createSyncTask(
    @Body('vesselId') vesselId: string,
    @Body('action') action: SyncAction,
    @Body('payload') payload: Record<string, any>,
  ) {
    return this.syncService.createSyncTask(vesselId, action, payload);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending sync tasks' })
  getPendingTasks(@Query('vesselId') vesselId?: string) {
    return this.syncService.getPendingTasks(vesselId);
  }

  @Post('process/:vesselId')
  @ApiOperation({ summary: 'Process sync batch for a vessel' })
  processSyncBatch(
    @Param('vesselId') vesselId: string,
    @Query('batchSize') batchSize?: string,
  ) {
    const size = batchSize ? parseInt(batchSize, 10) : 100;
    return this.syncService.processSyncBatch(vesselId, size);
  }
}

