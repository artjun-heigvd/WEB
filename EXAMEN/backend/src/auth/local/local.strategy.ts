import { Strategy } from 'passport-local';
import { PassportStrategy as NestPassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { PassportStrategy } from '@/auth/auth.constants';
import { User } from '@prisma/client';
import { ExpressAuthInfo } from '@/auth/types/express-auth-info.type';

type DoneCallback = (
  err: Error | null,
  user?: User | false,
  info?: ExpressAuthInfo,
) => void;

const authInfo: ExpressAuthInfo = {
  strategy: PassportStrategy.LOCAL,
};

@Injectable()
export class LocalStrategy extends NestPassportStrategy(
  Strategy,
  authInfo.strategy,
) {
  constructor(private authService: AuthService) {
    // Signature from https://www.passportjs.org/packages/passport-local/
    super(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username: string, password: string, done: DoneCallback) => {
        try {
          const user = await this.authService.validateCredentials({
            username,
            password,
          });

          done(null, user, authInfo);
        } catch (error) {
          done(null, false, authInfo);
        }
      },
    );
  }
}
