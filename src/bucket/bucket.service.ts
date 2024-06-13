import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Bucket } from 'src/users/schemas/bucket.model';
import { User } from 'src/users/schemas/user.model';
import { File } from 'src/users/schemas/file.model';
import { MulterFile } from './multer-file.interface'; // Custom interface
import { CreateBucketDto } from './dto/create-bucket.dto';

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
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const newBucket = new this.bucketModel({
      name: createBucketDto.bucketName,
      userId: user._id,
      files: [],
    });
    const bucket = await newBucket.save();
    user.buckets.push(bucket._id);
    await user.save();
    return {
      status: 200,
      error: '',
      message: 'Bucket Created successfully',
    };
  }

  async deleteBucket(
    userId: string,
    deleteBucketDto: CreateBucketDto,
  ): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const currentBucket: any = await this.bucketModel.find({
      name: deleteBucketDto.bucketName,
    });
    if (currentBucket !== null || currentBucket !== undefined) {
      await this.bucketModel.findByIdAndDelete(currentBucket?._id);
    } else {
      throw new Error('Bucket not found');
    }
    user.buckets = user.buckets.filter(
      (id) => id.toString() !== currentBucket?._id,
    );
    await user.save();
    return {
      status: 200,
      error: '',
      message: 'Bucket Deleted successfully',
    };
  }
  async uploadFile(bucketId: string, file: MulterFile): Promise<File> {
    const bucket = await this.bucketModel.findById(bucketId);
    if (!bucket) {
      throw new Error('Bucket not found');
    }
    const newFile = new this.fileModel({
      name: file.originalname,
      bucketId: bucket._id,
      path: file.path,
    });
    const savedFile = await newFile.save();
    bucket.files.push(savedFile.path);
    await bucket.save();
    return savedFile;
  }

  async getFileById(fileId: string): Promise<any> {
    const file = await this.fileModel.findById(fileId);
    if (!file) {
      throw new Error('File not found');
    }
    return file;
  }

  async getFileByName(name: string): Promise<any> {
    const file = await this.fileModel.findOne({ name });
    if (!file) {
      throw new Error('File not found');
    }
    return file;
  }
}
