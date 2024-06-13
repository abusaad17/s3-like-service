import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IsString } from 'class-validator';
import { Bucket } from './bucket.model'; // Assuming bucket.model.ts is in the same directory

@Schema()
export class File extends Document {
  @Prop({ required: true })
  @IsString()
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  bucketId: Bucket['_id'];

  @Prop({ required: true })
  @IsString()
  path: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
