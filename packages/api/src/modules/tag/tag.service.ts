import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { selectTag } from './tag.const';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  getAll() {
    return this.prisma.tag.findMany({
      select: selectTag,
      orderBy: { name: 'asc' },
    });
  }
}
