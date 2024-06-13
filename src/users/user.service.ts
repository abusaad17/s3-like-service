import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.model';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
  ) {}

  async register(registerDto: RegisterUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = new this.userModel({
      userId: registerDto.username,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async login(loginDto: LoginUserDto): Promise<string> {
    const username = loginDto.username;
    const user = await this.userModel.findOne({ userId: username });
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new Error('Invalid credentials');
    }
    return jwt.sign(
      { userId: user._id, name: user.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );
  }
}
