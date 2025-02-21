import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from '@/users/users.service';
import { LoginUser } from '@/auth/local/types/login-user.type';
import { JwtPayload } from '@/auth/jwt/types/jwt-payload.type';
import * as argon2id from 'argon2';
import { Jwt } from '@/auth/jwt/types/jwt.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateCredentials({ username, password }: LoginUser): Promise<User> {
    const user = (await this.usersService.getUserByUsername(username)) as User;

    const passwordsMatch = await argon2id.verify(
      user.password,
      password as string,
    );

    if (!passwordsMatch) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async generateJwt(user: User): Promise<Jwt> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    return {
      jwt: await this.jwtService.signAsync(payload),
    };
  }

  async validateJwtPayload({ sub }: JwtPayload): Promise<User> {
    const user = (await this.usersService.getUser(sub)) as User;

    return user;
  }
}
