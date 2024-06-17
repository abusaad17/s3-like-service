"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_model_1 = require("./schemas/user.model");
const mongoose = require("mongoose");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let AuthService = class AuthService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async register(registerDto) {
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
        if (!registerDto.password ||
            !registerDto.username ||
            registerDto.password === '' ||
            registerDto.password === '') {
            return {
                status: 400,
                error: 'BAD_REQUEST',
                message: 'Invalid or incorrect username or password',
                data: null,
            };
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const newUser = new this.userModel({
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
    async login(loginDto) {
        if (!loginDto.password ||
            !loginDto.username ||
            loginDto.password === '' ||
            loginDto.password === '') {
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
        const accessToken = jwt.sign({ userId: user._id, name: user.userId }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        return {
            error: '',
            message: 'Access token is generated',
            status: 200,
            data: {
                accessToken: accessToken,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map