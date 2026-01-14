import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatedRolesRequestDto {
  @ApiProperty({ description: 'role', example: 'Admin' })
  @IsNotEmpty({ message: 'Name role is required' })
  name: string;

  @ApiProperty({ description: 'description', example: 10 })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;
}

export class UpdatedRolesRequestDto extends PartialType(CreatedRolesRequestDto) { }
