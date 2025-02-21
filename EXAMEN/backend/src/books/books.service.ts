import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async getBooks() {
    return await this.prisma.book.findMany();
  }

  async getBook(id: string) {
    return await this.prisma.book.findFirst({
      where: { id },
    });
  }

  async createBook(createBook: Prisma.BookCreateInput) {
    const newBook = await this.prisma.book.create({
      data: {
        ...createBook,
      },
    });

    return newBook;
  }

  async updateBook(bookId: string, updateBook: Prisma.BookUpdateInput) {
    return await this.prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        ...updateBook,
      },
    });
  }

  deleteBook(bookId: string) {
    return this.prisma.book.delete({
      where: {
        id: bookId,
      },
    });
  }
}
