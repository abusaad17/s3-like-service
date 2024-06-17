import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { LoginUserDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@ApiTags('User onboarding api')
@Controller('api/auth')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto, @Res() res: any) {
    try {
      const response = await this.authService.register(registerDto);
      switch (response.status) {
        case 201:
          return res.status(HttpStatus.CREATED).json({
            error: response.error,
            status: response.status,
            message: response.message,
            data: response.data,
          });
        case 400:
          return res.status(HttpStatus.BAD_REQUEST).json({
            error: response.error,
            message: response.message,
            status: response.status,
            data: response.data,
          });
        default:
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: 500,
            error: 'Something went wrong',
            message: 'Something went wrong, please try again',
            data: null,
          });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Internal Server Error',
        status: 500,
        message: 'Server error',
        data: null,
      });
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDto, @Res() res: any) {
    try {
      const response = await this.authService.login(loginDto);
      switch (response.status) {
        case 200:
          return res.status(HttpStatus.OK).json({
            error: response.error,
            status: response.status,
            message: response.message,
            data: response.data,
          });
        case 400:
          return res.status(HttpStatus.BAD_REQUEST).json({
            error: response.error,
            message: response.message,
            status: response.status,
            data: response.data,
          });
        default:
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: 500,
            error: 'Something went wrong',
            message: 'Something went wrong, please try again',
            data: null,
          });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Internal Server Error',
        status: 500,
        message: 'Server error',
        data: null,
      });
    }
  }
}
