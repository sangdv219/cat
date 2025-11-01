import { SetMetadata } from '@nestjs/common';
export const RESOURCE_KEY = 'resourcs';
export const Resource = (...resources: string[]) => SetMetadata(RESOURCE_KEY, resources);
