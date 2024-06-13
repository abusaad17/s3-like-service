import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.model';
// import { VerifyClientCertMiddleware } from './middleware/cert-middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      // { name: 'Bucket', schema: Bucket },
      // { name: 'File', schema: File },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [], // Exporting the service
})
export class UserModule {}
// export class UserModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(VerifyClientCertMiddleware).forRoutes('v1/api');
//   }
// }
