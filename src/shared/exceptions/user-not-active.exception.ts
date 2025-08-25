import { ForbiddenException } from '@nestjs/common';

export class UserNotActiveException extends ForbiddenException {
  constructor(email: string) {
    super(
      `User with email ${email} is not active. Please contact support or try again later.`,
    );
  }
}
