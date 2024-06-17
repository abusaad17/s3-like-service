"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketModule = void 0;
const common_1 = require("@nestjs/common");
const bucket_controller_1 = require("./bucket.controller");
const bucket_service_1 = require("./bucket.service");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_middleware_1 = require("../auth/middleware/jwt-middleware");
const user_model_1 = require("src/auth/schemas/user.model");
const bucket_model_1 = require("src/auth/schemas/bucket.model");
const file_model_1 = require("src/auth/schemas/file.model");
const jwt_1 = require("@nestjs/jwt");
let BucketModule = class BucketModule {
    configure(consumer) {
        consumer.apply(jwt_middleware_1.VerifyAccessToken).forRoutes('v1/api');
    }
};
exports.BucketModule = BucketModule;
exports.BucketModule = BucketModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'User', schema: user_model_1.UserSchema },
                { name: 'Bucket', schema: bucket_model_1.BucketSchema },
                { name: 'File', schema: file_model_1.FileSchema },
            ]),
        ],
        controllers: [bucket_controller_1.BucketController],
        providers: [bucket_service_1.BucketService, jwt_1.JwtService],
        exports: [bucket_service_1.BucketService],
    })
], BucketModule);
//# sourceMappingURL=bucket.module.js.map