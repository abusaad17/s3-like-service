import { LoginUserDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';
export declare class UserController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterUserDto, res: any): Promise<any>;
    login(loginDto: LoginUserDto, res: any): Promise<any>;
}
