import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Give a unique username',
    example: 'yourname_11',
  })
  readonly username: string;

  @ApiProperty({
    description: 'Set a strong password above 8 characters',
    example: 'IHdh34fv@#$',
  })
  readonly password: string;
}
