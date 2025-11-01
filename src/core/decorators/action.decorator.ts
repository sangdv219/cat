import { SetMetadata } from '@nestjs/common';
export const ACTION_KEY = 'actions';
export const Action = (...resources: string[]) => SetMetadata(ACTION_KEY, resources);