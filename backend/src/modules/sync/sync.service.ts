import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncQueue, SyncAction, SyncStatus } from '../../entities/sync-queue.entity';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(SyncQueue)
    private syncQueueRepository: Repository<SyncQueue>,
  ) {}

  async createSyncTask(
    vesselId: string,
    action: SyncAction,
    payload: Record<string, any>,
  ): Promise<SyncQueue> {
    const syncTask = this.syncQueueRepository.create({
      vesselId,
      action,
      payload,
      status: SyncStatus.PENDING,
    });

    return this.syncQueueRepository.save(syncTask);
  }

  async getPendingTasks(vesselId?: string): Promise<SyncQueue[]> {
    const where: any = { status: SyncStatus.PENDING };
    if (vesselId) {
      where.vesselId = vesselId;
    }

    return this.syncQueueRepository.find({
      where,
      order: { createdAt: 'ASC' },
    });
  }

  async markAsSynced(id: string): Promise<void> {
    await this.syncQueueRepository.update(id, { status: SyncStatus.SYNCED });
  }

  async markAsFailed(id: string, errorMessage: string): Promise<void> {
    const task = await this.syncQueueRepository.findOne({ where: { id } });
    if (task) {
      task.status = SyncStatus.FAILED;
      task.errorMessage = errorMessage;
      task.retryCount += 1;
      await this.syncQueueRepository.save(task);
    }
  }

  async processSyncBatch(vesselId: string, batchSize: number = 100): Promise<void> {
    const pendingTasks = await this.getPendingTasks(vesselId);
    const batch = pendingTasks.slice(0, batchSize);

    for (const task of batch) {
      try {
        // Process sync task (implement actual sync logic here)
        await this.markAsSynced(task.id);
      } catch (error) {
        await this.markAsFailed(task.id, error.message);
      }
    }
  }
}

