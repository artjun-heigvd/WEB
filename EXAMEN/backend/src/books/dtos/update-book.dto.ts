import { OmitType, PartialType } from '@nestjs/swagger';
import { BookDto } from '@/books/dtos/book.dto';

export class UpdateBookDto extends PartialType(
  OmitType(BookDto, ['id'] as const),
) {}
