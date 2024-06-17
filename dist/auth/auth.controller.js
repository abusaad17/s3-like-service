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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const login_dto_1 = require("./dto/login.dto");
const swagger_1 = require("@nestjs/swagger");
const register_dto_1 = require("./dto/register.dto");
const auth_service_1 = require("./auth.service");
let UserController = class UserController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto, res) {
        try {
            const response = await this.authService.register(registerDto);
            switch (response.status) {
                case 201:
                    return res.status(common_1.HttpStatus.CREATED).json({
                        error: response.error,
                        status: response.status,
                        message: response.message,
                        data: response.data,
                    });
                case 400:
                    return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                        error: response.error,
                        message: response.message,
                        status: response.status,
                        data: response.data,
                    });
                default:
                    return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                        status: 500,
                        error: 'Something went wrong',
                        message: 'Something went wrong, please try again',
                        data: null,
                    });
            }
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: 'Internal Server Error',
                status: 500,
                message: 'Server error',
                data: null,
            });
        }
    }
    async login(loginDto, res) {
        try {
            const response = await this.authService.login(loginDto);
            switch (response.status) {
                case 200:
                    return res.status(common_1.HttpStatus.OK).json({
                        error: response.error,
                        status: response.status,
                        message: response.message,
                        data: response.data,
                    });
                case 400:
                    return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                        error: response.error,
                        message: response.message,
                        status: response.status,
                        data: response.data,
                    });
                default:
                    return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                        status: 500,
                        error: 'Something went wrong',
                        message: 'Something went wrong, please try again',
                        data: null,
                    });
            }
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: 'Internal Server Error',
                status: 500,
                message: 'Server error',
                data: null,
            });
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('User onboarding api'),
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], UserController);
//# sourceMappingURL=auth.controller.js.map