import { Injectable, NotFoundException } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Bucket } from 'src/auth/schemas/bucket.model';
import { User } from 'src/auth/schemas/user.model';
import { File } from 'src/auth/schemas/file.model';
import { MulterFile } from './multer-file.interface'; // Custom interface
import { CreateBucketDto } from './dto/create-bucket.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class BucketService {
  constructor(
    @InjectModel(Bucket.name) private bucketModel: mongoose.Model<Bucket>,
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    @InjectModel(File.name) private fileModel: mongoose.Model<File>,
  ) {}

  async createBucket(
    createBucketDto: CreateBucketDto,
    userId: string,
  ): Promise<any> {
    if(createBucketDto.bucketName === '' || createBucketDto.description === ''){
      return {
        status: 400,
        error: 'BAD_REQUEST',
        message: 'Invalid or missing bucket name or description',
        data: null,
      };
    }
    const existingBucket = await this.bucketModel.findOne({
      name: createBucketDto.bucketName,
    });
    if(existingBucket?.isDelete){
      return {
        status: 400,
        error: 'BAD_REQUEST',
        message: 'Bucket previously deleted',
        data: null,
      };
    }
    if (existingBucket !== null) {
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
    user.buckets.push(bucket._id.toString());
    await user.save();
    return {
      status: 201,
      error: '',
      bucketId: newBucket._id.toString(),
      message: `Bucket: ${newBucket.name} Created successfully`,
    };
  }

  async deleteBucket(userId: string, bucketId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      return {
        status: 400,
        error: 'BAD_REQUEST',
        message: 'User does not exist',
        data: null,
      };
    }
    const currentBucket: any = await this.bucketModel.findById(bucketId);
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
    } else {
      return {
        status: 400,
        error: 'BAD_REQUEST',
        message: 'Bucket does not exist',
        data: null,
      };
    }
    user.buckets = user.buckets.filter(
      (id) => id.toString() !== currentBucket?._id.toString(),
    );
    await user.save();
    return {
      status: 200,
      error: '',
      message: `Bucket: ${currentBucket.name} Deleted successfully`,
      data: null,
    };
  }

  async listBucket(userId: string, page: number, limit: number): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      return {
        status: 400,
        error: 'BAD_REQUEST',
        message: 'User does not exist',
        data: null,
      };
    }
    const totalBuckets = await this.bucketModel.countDocuments({ userId, isDelete: false });
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

  async uploadFile(
    bucketId: string,
    file: MulterFile,
    filePath: string,
  ): Promise<any> {
    const bucket = await this.bucketModel.findById(bucketId);
    if (!bucket || bucket.isDelete) {
      return {
        status: 400,
        error: '',
        message: 'Bucket not found or might be deleted',
        data: null,
      };
    }
    if (!file) {
      return {
        status: 400,
        error: '',
        message: 'File not found',
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
    bucket.files.push(filePath);
    await bucket.save();
    return {
      status: 200,
      fileName: savedFile.name,
      fileId: savedFile._id,
      filePath: savedFile.path,
    };
  }

  async getFileByFileId(fileId: string, userId: string): Promise<any> {
    const existingFile = await this.fileModel.findById(fileId);
    const existingBucket = await this.bucketModel.findById(existingFile?.bucketId);
    if(existingBucket.userId !== userId){
      return {
        status: 400,
        error: '',
        message: 'The requested file belongs to another user',
        data: null,
      };
    }
    if(existingBucket?.isDelete){
      return {
        status: 400,
        error: '',
        message: 'This bucket is already deleted',
        data: null,
      };
    }
    const file = await this.fileModel.findById(fileId);
    if (!file || file.isDelete) {
      return {
        status: 400,
        error: '',
        message: 'File already deleted or not found',
        data: null,
      };
    }
    return {
      status: 200,
      error: '',
      message: 'File retreived successfully',
      data: file,
    };
  }

  async deleteFile(fileId: string): Promise<any> {
    const file = await this.fileModel.findById(new ObjectId(fileId));
    if (!file || file.isDelete) {
      throw new NotFoundException('File not found or already deleted');
    }

    file.isDelete = true;
    await file.save();

    const bucket = await this.bucketModel.findById(file.bucketId);
    if (!bucket) {
      throw new NotFoundException('Bucket not found or already deleted');
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

  async getFileByBucketId(bucketId: string): Promise<any> {
    const existingBucket = await this.bucketModel.findById(bucketId);
    if(existingBucket.isDelete){
      return {
        status: 400,
        error: '',
        message: 'This bucket is already deleted',
        data: null,
      };
    }
    const file = await this.fileModel.find({ bucketId: bucketId, isDelete: false });
    if (file.length === 0) {
      return {
        status: 400,
        error: '',
        message: 'This bucket has no files',
        data: null,
      };
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
      message: 'Files retreived successfully'
    };
  }
}
