import { Controller, Post, HttpCode, Res } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthService } from '@/auth/auth.service';
import { LoginUserDto } from '@/auth/local/dtos/login-user.dto';
import { LocalAuth } from '@/auth/local/local-auth.decorator';
import { JwtDto } from '@/auth/jwt/dtos/jwt.dto';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @LocalAuth()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Log in with username and password',
    description: 'Log in with username and password.',
    operationId: 'login',
  })
  @ApiBody({
    description: "The user's credentials.",
    type: LoginUserDto,
  })
  @ApiOkResponse({
    description: 'The user has been successfully logged in.',
    type: JwtDto,
  })
  async login(
    @AuthUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwt = await this.authService.generateJwt(user);

    res.cookie('jwt', jwt.jwt, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
    });

    return new JwtDto(jwt);
  }
}
