import { BookDto } from '@/books/dtos/book.dto';
import { OmitType } from '@nestjs/swagger';

export class CreateBookDto extends OmitType(BookDto, ['id'] as const) {}
