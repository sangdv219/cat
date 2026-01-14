import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class CreatedAnalyticsRequestDto {
  @ApiProperty({ description: 'Analytics', example: 'Analytics' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ description: 'image', example: '' })
  @IsOptional()
  image: string;

  @IsOptional()
  @ApiProperty({ description: 'is_public', example: true })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'is_public must be a boolean (true/false)' })
  is_public: boolean = false;
}

export class UpdatedAnalyticsRequestDto extends PartialType(CreatedAnalyticsRequestDto) {}
