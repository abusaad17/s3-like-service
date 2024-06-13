// import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
// import { IsBoolean, IsString } from 'class-validator';

// @Schema({
//   timestamps: true,
// })
// export class BlockList {
//   @Prop({ type: String, required: true })
//   @IsString()
//   hardwareId: string;

//   @Prop({ type: Boolean, default: false })
//   @IsBoolean()
//   isBlocked: boolean;
// }

// export const BlockListSchema = SchemaFactory.createForClass(BlockList);

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IsString, IsArray } from 'class-validator';
import { User } from './user.model';
// import { User } from './user.model'; // Assuming user.model.ts is in the same directory

@Schema()
export class Bucket extends Document {
  @Prop({ required: true })
  @IsString()
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  userId: User['_id'];

  @Prop({ type: [String] })
  @IsArray()
  files: string[];
}

export const BucketSchema = SchemaFactory.createForClass(Bucket);
