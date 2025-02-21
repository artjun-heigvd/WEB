import { ApiProperty } from '@nestjs/swagger';
import { Book } from '@prisma/client';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class BookDto implements Book {
  /**
   * Identification of the book
   */
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;

  /**
   * title of the book
   */
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  /**
   * author of the book
   */
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  author: string;
}
