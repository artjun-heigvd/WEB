import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from '@/auth/auth.controller';
import { LocalStrategy } from '@/auth/local/local.strategy';
import { JwtStrategy } from '@/auth/jwt/jwt.strategy';
import { AuthService } from '@/auth/auth.service';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => ({
        secret: 'examen_web',
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
    PassportModule,
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
