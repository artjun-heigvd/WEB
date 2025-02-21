import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { BooksApiController } from '@/books/books.controller';
import { BooksService } from '@/books/books.service';

@Module({
  imports: [PrismaModule],
  controllers: [BooksApiController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
