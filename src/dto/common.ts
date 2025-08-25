import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @ApiPropertyOptional({ description: 'page', example: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @ApiPropertyOptional({ description: 'limit', example: 10 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @ApiPropertyOptional({ description: 'keyword', example: '' })
  @IsString()
  keyword?: string;
}
