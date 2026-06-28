import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('summary')
  summary(@Query('workspaceId') workspaceId: string, @Query('from') from: string, @Query('to') to: string) {
    return this.analytics.summary(workspaceId, from, to);
  }

  @Post('reset')
  reset(@Body() body: { workspaceId: string; linkId: string }) {
    return this.analytics.reset(body.workspaceId, body.linkId);
  }
}
