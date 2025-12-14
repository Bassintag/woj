import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { tagSelect } from '@woj/common/select';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  getAll() {
    return this.prisma.tag.findMany({
      select: tagSelect,
      orderBy: { name: 'asc' },
    });
  }
}
