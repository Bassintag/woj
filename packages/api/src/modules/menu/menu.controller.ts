import { Body, Controller, Post } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './menu.dto';

@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() body: CreateMenuDto) {
    return this.menuService.createMenu(body);
  }
}
