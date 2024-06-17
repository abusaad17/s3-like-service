// import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
// import { IsString, IsBoolean, IsArray } from 'class-validator';

// @Schema({
//   timestamps: true,
// })
// export class Edge {
//   @Prop({ required: true, unique: true })
//   @IsString()
//   hardwareId: string;

//   @Prop({ required: true })
//   @IsString()
//   edgeId: string;

//   @Prop()
//   @IsArray()
//   tags: string[];

//   @Prop({ required: true })
//   @IsString()
//   status: string;

//   @Prop()
//   @IsString()
//   description: string;

//   @Prop()
//   @IsString()
//   domainUri: string;

//   @Prop()
//   @IsString()
//   domainId: string;

//   @Prop()
//   @IsString()
//   authTokenId: string;

//   @Prop({ required: true })
//   @IsArray()
//   emails: string[];

//   @Prop({ required: true })
//   @IsBoolean()
//   access: boolean;
// }

// export const EdgeSchema = SchemaFactory.createForClass(Edge);

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsBoolean, IsString } from 'class-validator';
// import { Bucket } from './bucket.model'; // Assuming bucket.model.ts is in the same directory

@Schema()
export class User extends Document {
  @Prop({ required: true })
  @IsString()
  userId: string;

  @Prop({ required: true })
  @IsString()
  password: string;

  @Prop({ required: true })
  @IsBoolean()
  isDelete: boolean;

  @Prop()
  buckets: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
