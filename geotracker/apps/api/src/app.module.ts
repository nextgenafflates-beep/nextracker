import { Module } from '@nestjs/common';
import { PrismaService } from './common/prisma.service';
import { LinksModule } from './modules/links/links.module';
import { RedirectModule } from './modules/redirect/redirect.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { QueueModule } from './modules/queue/queue.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthController } from './health.controller';

@Module({
  imports: [LinksModule, RedirectModule, AnalyticsModule, QueueModule, AuthModule],
  controllers: [HealthController],
  providers: [PrismaService]
})
export class AppModule {}
