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
exports.BucketService = void 0;
const common_1 = require("@nestjs/common");
const mongoose = require("mongoose");
const mongoose_1 = require("@nestjs/mongoose");
const bucket_model_1 = require("../auth/schemas/bucket.model");
const user_model_1 = require("../auth/schemas/user.model");
const file_model_1 = require("../auth/schemas/file.model");
const mongodb_1 = require("mongodb");
let BucketService = class BucketService {
    constructor(bucketModel, userModel, fileModel) {
        this.bucketModel = bucketModel;
        this.userModel = userModel;
        this.fileModel = fileModel;
    }
    async createBucket(createBucketDto, userId) {
        const existingBucket = await this.bucketModel.findOne({
            name: createBucketDto.bucketName,
        });
        if (createBucketDto.bucketName === '') {
            return {
                status: 400,
                error: 'BAD_REQUEST',
                message: 'Buckets name can not be empty',
                data: null,
            };
        }
        if (existingBucket !== null && !existingBucket.isDelete) {
            return {
                status: 400,
                error: 'BAD_REQUEST',
                message: 'Bucket with same name already exist',
                data: null,
            };
        }
        const user = await this.userModel.findById(userId);
        if (!user) {
            return {
                status: 400,
                error: 'BAD_REQUEST',
                message: 'User does not exist',
                data: null,
            };
        }
        const newBucket = new this.bucketModel({
            name: createBucketDto.bucketName,
            description: createBucketDto.description,
            userId: user._id.toString(),
            files: [],
            isDelete: false,
        });
        const bucket = await newBucket.save();
        user.buckets.push(bucket._id);
        await user.save();
        return {
            status: 201,
            error: '',
            bucketId: newBucket._id.toString(),
            message: `Bucket: ${newBucket.name} Created successfully`,
        };
    }
    async deleteBucket(userId, bucketId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            return {
                status: 400,
                error: 'BAD_REQUEST',
                message: 'User does not exist',
                data: null,
            };
        }
        const currentBucket = await this.bucketModel.findById(bucketId);
        if (currentBucket.isDelete) {
            return {
                status: 200,
                error: '',
                message: `Bucket: ${currentBucket.name} Deleted already`,
                data: null,
            };
        }
        if (currentBucket !== null || currentBucket !== undefined) {
            currentBucket.isDelete = true;
            await currentBucket.save();
        }
        else {
            return {
                status: 400,
                error: 'BAD_REQUEST',
                message: 'Bucket does not exist',
                data: null,
            };
        }
        user.buckets = user.buckets.filter((id) => id.toString() !== currentBucket?._id.toString());
        await user.save();
        return {
            status: 200,
            error: '',
            message: `Bucket: ${currentBucket.name} Deleted successfully`,
            data: null,
        };
    }
    async listBucket(userId, page, limit) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            return {
                status: 400,
                error: 'BAD_REQUEST',
                message: 'User does not exist',
                data: null,
            };
        }
        const totalBuckets = await this.bucketModel.countDocuments({ userId });
        const userBuckets = await this.bucketModel
            .find({ userId, isDelete: false })
            .skip((page - 1) * limit)
            .limit(limit);
        if (userBuckets.length === 0) {
            return {
                status: 400,
                error: '',
                message: 'User has no buckets',
                data: null,
            };
        }
        const data = userBuckets.map((bucket) => ({
            bucketId: bucket._id.toString(),
            bucketName: bucket.name,
            bucketDescription: bucket.description,
            filesCount: bucket.files.length,
        }));
        return {
            status: 200,
            error: '',
            data: data,
            page,
            limit,
            total: totalBuckets,
        };
    }
    async uploadFile(bucketId, file, filePath) {
        const bucket = await this.bucketModel.findById(bucketId);
        if (!bucket) {
            return {
                status: 400,
                error: '',
                message: 'Bucket not found',
                data: null,
            };
        }
        const newFile = new this.fileModel({
            name: file.filename,
            bucketId: bucket._id.toString(),
            path: filePath,
            isDelete: false,
        });
        const savedFile = await newFile.save();
        bucket.files.push(savedFile.path);
        await bucket.save();
        return {
            status: 200,
            fileName: savedFile.name,
            fileId: savedFile._id,
            filePath: savedFile.path,
        };
    }
    async getFileById(fileId) {
        const file = await this.fileModel.findById(fileId);
        if (!file || file.isDelete) {
            return {
                status: 400,
                error: '',
                message: 'Bucket already deleted ',
                data: null,
            };
        }
        return file;
    }
    async deleteFile(fileId) {
        const file = await this.fileModel.findById(new mongodb_1.ObjectId(fileId));
        if (!file || file.isDelete) {
            throw new common_1.NotFoundException('File not found or already deleted');
        }
        file.isDelete = true;
        await file.save();
        const bucket = await this.bucketModel.findById(file.bucketId);
        if (!bucket) {
            throw new common_1.NotFoundException('Bucket not found or already deleted');
        }
        bucket.files = bucket.files.filter((f) => f !== file.path);
        await bucket.save();
        return {
            message: 'File successfully deleted',
            fileId: file._id,
            fileName: file.name,
            filePath: file.path,
        };
    }
    async getFileByBucketName(bucketId) {
        const file = await this.fileModel.find({ bucketId: bucketId });
        if (!file) {
            throw new Error('File not found');
        }
        const data = file.map((obj) => {
            const res = {
                fileId: obj._id.toString(),
                fileName: obj?.name,
                filePath: obj?.path,
            };
            return res;
        });
        return {
            status: 200,
            error: '',
            data: data,
        };
    }
};
exports.BucketService = BucketService;
exports.BucketService = BucketService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bucket_model_1.Bucket.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(file_model_1.File.name)),
    __metadata("design:paramtypes", [mongoose.Model, mongoose.Model, mongoose.Model])
], BucketService);
//# sourceMappingURL=bucket.service.js.map