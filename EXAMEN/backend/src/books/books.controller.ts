import { Controller, Body, Param } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { Book } from '@prisma/client';
import { BooksService } from '@/books/books.service';
import { CreateBookDto } from '@/books/dtos/create-book.dto';
import { UpdateBookDto } from '@/books/dtos/update-book.dto';
import { ReadBookDto } from '@/books/dtos/read-book.dto';
import { GetMany } from '@/common/decorators/get-many.decorator';
import { GetOne } from '@/common/decorators/get-one.decorator';
import { CustomPost } from '@/common/decorators/custom-post.decorator';
import { CustomPatch } from '@/common/decorators/custom-patch.decorator';
import { CustomDelete } from '@/common/decorators/custom-delete.decorator';
import { BookDto } from '@/books/dtos/book.dto';

@ApiTags('Books')
@Controller('api/books')
export class BooksApiController {
  constructor(private readonly booksService: BooksService) {}

  @GetMany({
    name: 'Books',
    summary: 'Get the books',
    operationId: 'getBooksApi',
    responseType: [ReadBookDto],
  })
  async getBooksApi() {
    const books = await this.booksService.getBooks();

    const booksDto = books.map(
      (book: Partial<BookDto>) => new ReadBookDto(book),
    );

    return booksDto;
  }

  @GetOne({
    name: 'Book',
    summary: 'Get the specified book',
    operationId: 'getBookApi',
    responseType: ReadBookDto,
  })
  async getBookApi(@Param('id') id: string) {
    const book = (await this.booksService.getBook(id)) as Book;

    return new ReadBookDto(book);
  }

  @CustomPost({
    name: 'Book',
    summary: 'Create a new book',
    bodyType: CreateBookDto,
    responseType: ReadBookDto,
    operationId: 'createBookApi',
  })
  @ApiConflictResponse({
    description: 'Another book has the same bookname.',
  })
  async createBookApi(@Body() createBookDto: CreateBookDto) {
    const newBook = await this.booksService.createBook(createBookDto);

    return new ReadBookDto(newBook);
  }

  @CustomPatch({
    name: 'Book',
    summary: 'Update the specified book',
    bodyType: UpdateBookDto,
    responseType: ReadBookDto,
    operationId: 'updateBookApi',
  })
  @ApiConflictResponse({
    description: 'Another book has the same bookname.',
  })
  async updateBookApi(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    const updatedBook = await this.booksService.updateBook(id, updateBookDto);

    return new ReadBookDto(updatedBook);
  }

  @CustomDelete({
    name: 'Book',
    summary: 'Delete the specified book',
    operationId: 'deleteBookApi',
  })
  async deleteBookApi(@Param('id') id: string) {
    await this.booksService.deleteBook(id);
  }
}
