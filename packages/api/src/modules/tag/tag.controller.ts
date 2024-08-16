import { TagService } from './tag.service';
import { Controller, Get } from '@nestjs/common';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  getAll() {
    return this.tagService.getAll();
  }
}
