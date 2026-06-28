import { Module } from '@nestjs/common';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';
import { PrismaService } from '../../common/prisma.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [RedirectController],
  providers: [RedirectService, PrismaService]
})
export class RedirectModule {}
