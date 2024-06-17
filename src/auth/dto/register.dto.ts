import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Give your registered username',
    example: 'yourname_11',
  })
  readonly username: string;

  @ApiProperty({
    description: 'Give your password',
    example: 'IHdh34fv@#$',
  })
  readonly password: string;
}
