import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BucketController } from './bucket.controller';
import { BucketService } from './bucket.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifyAccessToken } from './middleware/jwt-middleware';
import { UserSchema } from 'src/users/schemas/user.model';
import { BucketSchema } from 'src/users/schemas/bucket.model';
import { FileSchema } from 'src/users/schemas/file.model';
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
// export class EdgesModule {}
export class BucketModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyAccessToken).forRoutes('v1/api');
  }
}
