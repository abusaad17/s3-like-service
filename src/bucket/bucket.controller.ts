import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BucketService } from './bucket.service';
import { extname, join } from 'path';
import { MulterFile } from './multer-file.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateBucketDto } from './dto/create-bucket.dto';

@ApiTags('CRUD APIs for buckets and files')
@Controller('v1/api')
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Post('bucket')
  @ApiBearerAuth()
  async createBucket(
    @Body() createBucketDto: CreateBucketDto,
    @Req() req: any,
    @Res() res: any,
  ) {
    try {
      const userId = req.headers['userId'];
      const response = await this.bucketService.createBucket(
        createBucketDto,
        userId,
      );
      switch (response.status) {
        case 200:
          return res.status(HttpStatus.CREATED).json({
            error: response.error,
            message: response.message,
          });
        case 400:
          return res.status(HttpStatus.BAD_REQUEST).json({
            error: response.error,
            message: response.message,
          });
        case 409:
          return res.status(HttpStatus.CONFLICT).json({
            error: response.error,
            message: response.message,
          });
        case 401:
          return res.status(HttpStatus.UNAUTHORIZED).json({
            error: response.error,
            message: response.message,
          });
        default:
          return res.status(HttpStatus.CONFLICT).json({
            status: 500,
            error: 'Something went wrong',
            message: 'Something went wrong, please try again',
          });
      }
    } catch (error) {
      console.error('Error creating bucket:', error);
      return res.status(HttpStatus.CONFLICT).json({
        status: 500,
        error: 'Something went wrong',
        message: 'Something went wrong, please try again',
      });
    }
  }

  @Delete('/:bucketname')
  @ApiBearerAuth()
  async deleteBucket(
    @Param('bucketname') deleteBucketDto: CreateBucketDto,
    @Body() body: { userId: string },
    @Req() req: any,
    @Res() res: any,
  ): Promise<any> {
    try {
      const userId = req.headers['userId'];
      await this.bucketService.deleteBucket(userId, deleteBucketDto);
      return res.status(HttpStatus.CREATED).json({
        error: '',
        message: 'Bucket deleted successfully',
      });
      // switch (response?.status) {
      //   case 200:
      //     return res.status(HttpStatus.CREATED).json({
      //       error: response.error,
      //       message: response.message,
      //     });
      //   case 400:
      //     return res.status(HttpStatus.BAD_REQUEST).json({
      //       error: response.error,
      //       message: response.message,
      //     });
      //   case 409:
      //     return res.status(HttpStatus.CONFLICT).json({
      //       error: response.error,
      //       message: response.message,
      //     });
      //   case 401:
      //     return res.status(HttpStatus.UNAUTHORIZED).json({
      //       error: response.error,
      //       message: response.message,
      //     });
      //   default:
      //     return res.status(HttpStatus.CONFLICT).json({
      //       status: 500,
      //       error: 'Something went wrong',
      //       message: 'Something went wrong, please try again',
      //     });
      // }
    } catch (error) {
      console.error('Error creating bucket:', error);
      return res.status(HttpStatus.CONFLICT).json({
        status: 500,
        error: 'Something went wrong',
        message: 'Something went wrong, please try again',
      });
    }
  }

  @Post('upload/:bucketId')
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(
    @Param('bucketId') bucketId: string,
    @UploadedFile() file: MulterFile,
  ) {
    return this.bucketService.uploadFile(bucketId, file);
  }

  @Get(':fileId')
  @ApiBearerAuth()
  async getFileById(@Param('fileId') fileId: string, @Res() res) {
    const file = await this.bucketService.getFileById(fileId);
    res.sendFile(join(__dirname, '../../uploads', file.path));
  }

  @Get('name/:fileName')
  @ApiBearerAuth()
  async getFileByName(@Param('fileName') fileName: string, @Res() res) {
    const file = await this.bucketService.getFileByName(fileName);
    res.sendFile(join(__dirname, '../../uploads', file.path));
  }
}
