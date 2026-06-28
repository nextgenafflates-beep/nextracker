import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { RedirectService } from './redirect.service';

@Controller('go')
export class RedirectController {
  constructor(private readonly service: RedirectService) {}

  @Get(':slug')
  async go(@Param('slug') slug: string, @Req() req: Request, @Res() res: Response) {
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    const url = await this.service.resolve(slug, req);
    return res.redirect(302, url);
  }
}
