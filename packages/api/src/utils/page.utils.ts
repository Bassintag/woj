import { PageableQueryDto } from '../dto/pageable-query.dto';

export const pageableToPrisma = ({ page = 0, size = 20 }: PageableQueryDto) => {
  return {
    skip: page * size,
    take: size,
  };
};

export const prismaToPage = <T>(
  { page = 0, size = 20 }: PageableQueryDto,
  [total, items]: [number, T[]],
) => {
  return { page, size, total, pages: Math.ceil(total / size), items };
};
