import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsBoolean, IsString } from 'class-validator';
// import { Bucket } from './bucket.model'; // Assuming bucket.model.ts is in the same directory

@Schema()
export class File extends Document {
  @Prop({ required: true })
  @IsString()
  name: string;

  @Prop({
    required: true,
  })
  bucketId: string;

  @Prop({ required: true })
  @IsString()
  path: string;

  @Prop({ required: true })
  @IsBoolean()
  isDelete: boolean;
}

export const FileSchema = SchemaFactory.createForClass(File);
