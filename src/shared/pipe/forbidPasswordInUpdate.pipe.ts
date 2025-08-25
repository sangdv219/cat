import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ForbidPasswordInUpdatePipe implements PipeTransform {
  transform(value: any) {
    if (value.password) {
      throw new BadRequestException('Password cannot be updated');
    }
    return value;
  }
}
