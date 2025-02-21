import { PickType } from '@nestjs/swagger';
import { UserDto } from '@/users/dtos/user.dto';
import { RegisterUser } from '@/auth/local/types/register-user.type';

export class RegisterUserDto
  extends PickType(UserDto, ['username'] as const)
  implements RegisterUser {}
