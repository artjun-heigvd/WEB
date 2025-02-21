import { BookDto } from '@/books/dtos/book.dto';

export class ReadBookDto extends BookDto {
  constructor(partial: Partial<BookDto>) {
    super();

    Object.assign(this, partial);
  }
}
