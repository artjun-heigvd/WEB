import { OmitType } from '@nestjs/swagger';
import { UserDto } from '@/users/dtos/user.dto';

export class CreateUserDto extends OmitType(UserDto, ['id'] as const) {}
