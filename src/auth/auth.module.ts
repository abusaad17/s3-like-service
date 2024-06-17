import { Module } from '@nestjs/common';
import { UserController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.model';
import { JwtService } from '@nestjs/jwt';
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
  providers: [AuthService, JwtService],
  exports: [], // Exporting the service
})
export class AuthModule {}
