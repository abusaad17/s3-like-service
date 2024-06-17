import { BucketService } from './bucket.service';
import { MulterFile } from './multer-file.interface';
import { CreateBucketDto } from './dto/create-bucket.dto';
export declare class BucketController {
    private readonly bucketService;
    constructor(bucketService: BucketService);
    createBucket(createBucketDto: CreateBucketDto, req: any, res: any): Promise<any>;
    deleteBucket(bucketId: string, req: any, res: any): Promise<any>;
    listBucket(req: any, res: any, page?: number, limit?: number): Promise<any>;
    uploadFile(bucketId: string, file: MulterFile, res: any): Promise<any>;
    deleteFile(fileId: string, res: any): Promise<void>;
    getFileById(fileId: string, res: any): Promise<any>;
    getFileByBucketName(bucketId: string, res: any): Promise<void>;
}
