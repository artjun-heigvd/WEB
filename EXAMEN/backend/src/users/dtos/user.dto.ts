import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UserDto implements Omit<User, 'resetPasswordRequestId'> {
  /**
   * Identification of the user
   */
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;

  /**
   * Username of the user
   */
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  username: string;

  /**
   * Password of the user
   */
  @ApiProperty({ format: 'password' })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}
