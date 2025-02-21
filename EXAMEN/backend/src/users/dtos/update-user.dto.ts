import { OmitType, PartialType } from '@nestjs/swagger';
import { UserDto } from '@/users/dtos/user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(UserDto, ['id'] as const),
) {}
