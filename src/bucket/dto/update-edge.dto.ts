import { ApiProperty } from '@nestjs/swagger';

export class UpdateEdgeDto {
  @ApiProperty({
    description: 'Tags for edge device',
    example: ['tag1', 'tag2'],
  })
  readonly tags: string[];

  @ApiProperty({
    description: 'Description for edge device',
    example: 'This is the description',
  })
  readonly description: string;

  @ApiProperty({
    description: 'Email Ids for edge device',
    example: '**@**.com',
  })
  readonly emailIds: string[];
}
