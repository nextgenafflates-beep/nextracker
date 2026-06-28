import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { LinksService } from './links.service';

@Controller('links')
export class LinksController {
  constructor(private readonly links: LinksService) {}

  @Get()
  list(@Query('workspaceId') workspaceId: string) { return this.links.list(workspaceId); }

  @Get(':id')
  get(@Param('id') id: string) { return this.links.get(id); }

  @Post()
  create(@Body() body: any) { return this.links.create(body); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.links.update(id, body); }

  @Get('domains')
  listDomains(@Query('workspaceId') workspaceId: string) { return this.links.listDomains(workspaceId); }

  @Post('domains')
  createDomain(@Body() body: any) { return this.links.createDomain(body); }
}
