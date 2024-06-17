import { ApiProperty } from '@nestjs/swagger';

export class CreateBucketDto {
  @ApiProperty({
    description: 'Set a strong and unique bucket name',
    example: 'bucket_01',
  })
  readonly bucketName: string;

  @ApiProperty({
    description: 'Set a strong bucket name',
    example: 'bucket_01',
  })
  readonly description: string;
}
