import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { BooksModule } from '@/books/books.module';

@Module({
  imports: [AuthModule, BooksModule, UsersModule],
})
export class AppModule {}
