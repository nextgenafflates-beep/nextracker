import { Module } from '@nestjs/common';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [LinksController],
  providers: [LinksService, PrismaService],
  exports: [LinksService]
})
export class LinksModule {}
