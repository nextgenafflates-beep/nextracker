import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private queue!: Queue;
  private conn!: IORedis;
  private readonly logger = new Logger(QueueService.name);

  onModuleInit() {
    if (!process.env.REDIS_URL) {
      this.logger.error('REDIS_URL environment variable is not set');
      throw new Error('REDIS_URL is required');
    }
    
    this.conn = new IORedis(process.env.REDIS_URL);
    this.queue = new Queue('clicks', { connection: this.conn });
  }

  async onModuleDestroy() {
    if (this.queue) {
      await this.queue.close();
    }
    if (this.conn) {
      await this.conn.quit();
    }
  }

  enqueueClick(payload: any) {
    if (!payload || !payload.linkId || !payload.workspaceId) {
      this.logger.error('Invalid click payload:', payload);
      throw new Error('Invalid click payload');
    }
    return this.queue.add('ingest', payload);
  }
}
