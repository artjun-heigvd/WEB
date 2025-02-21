import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import * as argon2id from 'argon2';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async getUser(id: string) {
    return await this.prisma.user.findFirst({
      where: { id },
    });
  }

  async getUserByUsername(username: string) {
    return await this.prisma.user.findFirst({
      where: { username },
    });
  }

  async createUser(createUser: Omit<Prisma.UserCreateInput, 'password'>) {
    // Generate a random password for the user until they set it
    const password = await argon2id.hash(randomBytes(20).toString('hex'));

    const newUser = await this.prisma.user.create({
      data: {
        ...createUser,
        password,
      },
    });

    return newUser;
  }

  async updateUser(userId: string, updateUser: Prisma.UserUpdateInput) {
    let password = updateUser.password;

    if (password && typeof password === 'string') {
      password = await argon2id.hash(password);
    }

    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...updateUser,
        password,
      },
    });
  }

  deleteUser(userId: string) {
    return this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
