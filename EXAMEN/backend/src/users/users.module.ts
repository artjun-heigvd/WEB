import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { UsersService } from '@/users/users.service';
import { UsersApiController } from '@/users/users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersApiController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
