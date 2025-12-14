import { Controller, Post } from '@nestjs/common';
import { ActionService } from './action.service';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post('scrape')
  create() {
    this.actionService.scrapeAll();
  }
}
