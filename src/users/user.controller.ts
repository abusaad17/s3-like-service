import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register.dto';
import { UserService } from './user.service';

@ApiTags('User onboarding api')
@Controller('api/auth')
export class UserController {
  constructor(private readonly authService: UserService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterUserDto,
    // @Req() req: any,
    // @Res() res: any,
  ) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }
}
