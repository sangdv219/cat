import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatedPermissionssRequestDto {
  @ApiProperty({ description: 'permission', example: 'Admin' })
  @IsNotEmpty({ message: 'Name permission is required' })
  name: string;

  @ApiProperty({ description: 'description', example: 10 })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;
}

export class UpdatedPermissionssRequestDto extends PartialType(CreatedPermissionssRequestDto) { }
