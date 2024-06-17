import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
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

  //************BUCKET-CRUD-API**************** */
  @Post('bucket') // Create a new bucket
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
        case 201:
          return res.status(HttpStatus.CREATED).json({
            error: response.error,
            bucketId: response.bucketId,
            message: response.message,
          });
        case 400:
          return res.status(HttpStatus.BAD_REQUEST).json({
            error: response.error,
            message: response.message,
          });
        default:
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: 500,
            error: 'Something went wrong',
            message: 'Something went wrong, please try again',
          });
      }
    } catch (error) {
      console.error('Error creating bucket:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        error: 'Something went wrong',
        message: 'Something went wrong, please try again',
      });
    }
  }

  @Delete('bucket/:bucketId') // Delete a bucket
  @ApiBearerAuth()
  async deleteBucket(
    @Param('bucketId') bucketId: string,
    @Req() req: any,
    @Res() res: any,
  ): Promise<any> {
    try {
      const userId = req.headers['userId'];
      const response = await this.bucketService.deleteBucket(userId, bucketId);
      switch (response.status) {
        case 200:
          return res.status(HttpStatus.OK).json({
            error: response.error,
            status: response.status,
            message: response.message,
            data: response.data,
          });
        case 400:
          return res.status(HttpStatus.BAD_REQUEST).json({
            error: response.error,
            message: response.message,
            status: response.status,
            data: response.data,
          });
        default:
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: 500,
            error: 'Something went wrong',
            message: 'Something went wrong, please try again',
            data: null,
          });
      }
    } catch (error) {
      console.error('Error creating bucket:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        error: 'Something went wrong',
        message: 'Something went wrong, please try again',
      });
    }
  }

  @Get('bucket') // Get a bucket list with pagination
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async listBucket(
    @Req() req: any,
    @Res() res: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    try {
      const userId = req.headers['userId'];
      const response = await this.bucketService.listBucket(userId, page, limit);
      if (response.status === 200) {
        return res.status(HttpStatus.OK).json({
          error: '',
          data: response.data,
          page: response.page,
          limit: response.limit,
          total: response.total,
        });
      }
      if (response.status === 400) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: '',
          message: response.message,
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

  //************END**************** */

  //************FILE-CRUD-API**************** */

  @Put('upload/:bucketId') // create a new file upload to given bucket
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
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
  @ApiBody({
    description: 'File upload',
    required: true,
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @Param('bucketId') bucketId: string,
    @UploadedFile() file: MulterFile,
    @Res() res: any,
  ) {
    const filePath = join(__dirname, '../../uploads', file.filename);
    console.log(filePath);
    const response = await this.bucketService.uploadFile(
      bucketId,
      file,
      filePath,
    );
    switch (response.status) {
      case 200:
        return res.status(HttpStatus.OK).json({
          status: response.status,
          fileName: response.fileName,
          fileId: response.fileId.toString(),
          filePath: response.filePath,
        });
      case 400:
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: response.error,
          message: response.message,
          status: response.status,
          data: response.data,
        });
      default:
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: 500,
          error: 'Something went wrong',
          message: 'Something went wrong, please try again',
          data: null,
        });
    }
  }

  @Delete('/:fileId') // delete file from the bucket
  @ApiBearerAuth()
  async deleteFile(@Param('fileId') fileId: string, @Res() res) {
    const file = await this.bucketService.deleteFile(fileId);
    res.sendFile(file.filePath);
  }

  @Get('/:fileId') // get file from the bucket by ID
  @ApiBearerAuth()
  async getFileById(@Param('fileId') fileId: string, @Res() res) {
    const response = await this.bucketService.getFileById(fileId);
    if (response.status === 400) {
      return res.status(400).send(response.message);
    }
    res.sendFile(response.path);
  }

  @Get('files/:bucketId') // get file from the bucket by bucket
  @ApiBearerAuth()
  async getFileByBucketName(@Param('bucketId') bucketId: string, @Res() res) {
    const file = await this.bucketService.getFileByBucketName(bucketId);
    res.send(file);
  }

  //************END**************** */
}
