/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import * as mongoose from 'mongoose';
import { Bucket } from 'src/auth/schemas/bucket.model';
import { User } from 'src/auth/schemas/user.model';
import { File } from 'src/auth/schemas/file.model';
import { MulterFile } from './multer-file.interface';
import { CreateBucketDto } from './dto/create-bucket.dto';
export declare class BucketService {
    private bucketModel;
    private userModel;
    private fileModel;
    constructor(bucketModel: mongoose.Model<Bucket>, userModel: mongoose.Model<User>, fileModel: mongoose.Model<File>);
    createBucket(createBucketDto: CreateBucketDto, userId: string): Promise<any>;
    deleteBucket(userId: string, bucketId: string): Promise<any>;
    listBucket(userId: string, page: number, limit: number): Promise<any>;
    uploadFile(bucketId: string, file: MulterFile, filePath: string): Promise<any>;
    getFileById(fileId: string): Promise<any>;
    deleteFile(fileId: string): Promise<any>;
    getFileByBucketName(bucketId: string): Promise<any>;
}
