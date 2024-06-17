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
import { Document } from 'mongoose';
import { IsString, IsArray, IsBoolean } from 'class-validator';

@Schema()
export class Bucket extends Document {
  @Prop({ required: true })
  @IsString()
  name: string;

  @Prop({ required: true })
  @IsString()
  description: string;

  @Prop({ required: true })
  @IsBoolean()
  isDelete: boolean;

  @Prop({
    required: true,
  })
  userId: string;

  @Prop({ type: [String] })
  @IsArray()
  files: string[];
}

export const BucketSchema = SchemaFactory.createForClass(Bucket);
