import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.model';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
  ) {}

  async register(registerDto: RegisterUserDto): Promise<any> {
    const existingUser = await this.userModel.findOne({
      userId: registerDto.username,
    });
    if (existingUser !== null) {
      return {
        status: 400,
        error: 'BAD_REQUEST',
        message: 'User already registered . Username should be unique.',
        data: null,
      };
    }
    if (
      !registerDto.password ||
      !registerDto.username ||
      registerDto.password === '' ||
      registerDto.password === ''
    ) {
      return {
        status: 400,
        error: 'BAD_REQUEST',
        message: 'Invalid or incorrect username or password',
        data: null,
      };
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser: User = new this.userModel({
      userId: registerDto.username,
      password: hashedPassword,
      isDelete: false,
    });
    await newUser.save();
    return {
      status: 201,
      error: '',
      message: `User: ${newUser?.userId} is  created successfully`,
      data: null,
    };
  }

  async login(loginDto: LoginUserDto): Promise<any> {
    if (
      !loginDto.password ||
      !loginDto.username ||
      loginDto.password === '' ||
      loginDto.password === ''
    ) {
      return {
        status: 400,
        error: 'BAD_REQUEST',
        message: 'Invalid or incorrect username or password',
        data: null,
      };
    }
    const username = loginDto.username;
    const user = await this.userModel.findOne({ userId: username });
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      return {
        status: 400,
        error: 'BAD_REQUEST',
        message: 'User does not exist or incorrect password',
        data: null,
      };
    }
    const accessToken = jwt.sign(
      { userId: user._id, name: user.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );

    return {
      error: '',
      message: 'Access token is generated',
      status: 200,
      data: {
        accessToken: accessToken,
      },
    };
  }
}
