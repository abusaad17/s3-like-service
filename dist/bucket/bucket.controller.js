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
exports.BucketController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bucket_service_1 = require("./bucket.service");
const path_1 = require("path");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const create_bucket_dto_1 = require("./dto/create-bucket.dto");
let BucketController = class BucketController {
    constructor(bucketService) {
        this.bucketService = bucketService;
    }
    async createBucket(createBucketDto, req, res) {
        try {
            const userId = req.headers["userId"];
            const response = await this.bucketService.createBucket(createBucketDto, userId);
            switch (response.status) {
                case 201:
                    return res.status(common_1.HttpStatus.CREATED).json({
                        error: response.error,
                        bucketId: response.bucketId,
                        message: response.message,
                    });
                case 400:
                    return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                        error: response.error,
                        message: response.message,
                    });
                default:
                    return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                        status: 500,
                        error: "Something went wrong",
                        message: "Something went wrong, please try again",
                    });
            }
        }
        catch (error) {
            console.error("Error creating bucket:", error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 500,
                error: "Something went wrong",
                message: "Something went wrong, please try again",
            });
        }
    }
    async deleteBucket(bucketId, req, res) {
        try {
            const userId = req.headers["userId"];
            const response = await this.bucketService.deleteBucket(userId, bucketId);
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
                        error: "Something went wrong",
                        message: "Something went wrong, please try again",
                        data: null,
                    });
            }
        }
        catch (error) {
            console.error("Error creating bucket:", error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 500,
                error: "Something went wrong",
                message: "Something went wrong, please try again",
            });
        }
    }
    async listBucket(req, res, page = 1, limit = 10) {
        try {
            const userId = req.headers["userId"];
            const response = await this.bucketService.listBucket(userId, page, limit);
            if (response.status === 200) {
                return res.status(common_1.HttpStatus.OK).json({
                    error: "",
                    data: response.data,
                    page: response.page,
                    limit: response.limit,
                    total: response.total,
                });
            }
            if (response.status === 400) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    error: "",
                    message: response.message,
                });
            }
        }
        catch (error) {
            console.error("Error creating bucket:", error);
            return res.status(common_1.HttpStatus.CONFLICT).json({
                status: 500,
                error: "Something went wrong",
                message: "Something went wrong, please try again",
            });
        }
    }
    async uploadFile(bucketId, file, res) {
        const filePath = (0, path_1.join)(__dirname, "../../uploads", file.filename);
        console.log(filePath);
        const response = await this.bucketService.uploadFile(bucketId, file, filePath);
        switch (response.status) {
            case 200:
                return res.status(common_1.HttpStatus.OK).json({
                    status: response.status,
                    fileName: response.fileName,
                    fileId: response.fileId.toString(),
                    filePath: response.filePath,
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
                    error: "Something went wrong",
                    message: "Something went wrong, please try again",
                    data: null,
                });
        }
    }
    async deleteFile(fileId, res) {
        const file = await this.bucketService.deleteFile(fileId);
        res.sendFile(file.filePath);
    }
    async getFileById(fileId, res, req) {
        const userId = req.headers["userId"];
        const response = await this.bucketService.getFileByFileId(fileId, userId);
        switch (response.status) {
            case 200:
                return res.status(common_1.HttpStatus.OK).json({
                    status: response.status,
                    error: response.error,
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
                    error: "Something went wrong",
                    message: "Something went wrong, please try again",
                    data: null,
                });
        }
    }
    async getFileByBucketName(bucketId, res) {
        const response = await this.bucketService.getFileByBucketId(bucketId);
        switch (response.status) {
            case 200:
                return res.status(common_1.HttpStatus.OK).json({
                    status: response.status,
                    error: response.error,
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
                    error: "Something went wrong",
                    message: "Something went wrong, please try again",
                    data: null,
                });
        }
    }
};
exports.BucketController = BucketController;
__decorate([
    (0, common_1.Post)("bucket"),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bucket_dto_1.CreateBucketDto, Object, Object]),
    __metadata("design:returntype", Promise)
], BucketController.prototype, "createBucket", null);
__decorate([
    (0, common_1.Delete)("bucket/:bucketId"),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)("bucketId")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BucketController.prototype, "deleteBucket", null);
__decorate([
    (0, common_1.Get)("bucket"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ name: "page", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: false, type: Number }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)("page")),
    __param(3, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number, Number]),
    __metadata("design:returntype", Promise)
], BucketController.prototype, "listBucket", null);
__decorate([
    (0, common_1.Put)("upload/:bucketId"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: "./uploads",
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join("");
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    (0, swagger_1.ApiBody)({
        description: "File upload",
        required: true,
        type: "multipart/form-data",
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)("bucketId")),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BucketController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Delete)("file/:fileId"),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)("fileId")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BucketController.prototype, "deleteFile", null);
__decorate([
    (0, common_1.Get)("file/:fileId"),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)("fileId")),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BucketController.prototype, "getFileById", null);
__decorate([
    (0, common_1.Get)("getfile/:bucketId"),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)("bucketId")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BucketController.prototype, "getFileByBucketName", null);
exports.BucketController = BucketController = __decorate([
    (0, swagger_1.ApiTags)("CRUD APIs for buckets and files"),
    (0, common_1.Controller)("v1/api"),
    __metadata("design:paramtypes", [bucket_service_1.BucketService])
], BucketController);
//# sourceMappingURL=bucket.controller.js.map