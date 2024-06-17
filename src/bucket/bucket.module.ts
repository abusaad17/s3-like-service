import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BucketController } from './bucket.controller';
import { BucketService } from './bucket.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifyAccessToken } from '../auth/middleware/jwt-middleware';
import { UserSchema } from 'src/auth/schemas/user.model';
import { BucketSchema } from 'src/auth/schemas/bucket.model';
import { FileSchema } from 'src/auth/schemas/file.model';
import { JwtService } from '@nestjs/jwt';
// import { VerifyClientCertMiddleware } from './middleware/cert-middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Bucket', schema: BucketSchema },
      { name: 'File', schema: FileSchema },
    ]),
  ],
  controllers: [BucketController],
  providers: [BucketService, JwtService],
  exports: [BucketService], // Exporting the service
})
export class BucketModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyAccessToken).forRoutes('v1/api');
  }
}
