import { BaseRepository } from '@/domain/repositories/base.repository';
import { UserEntity } from '@/infrastructure/models/user.model';

export abstract class AbstractAnalyticsRepository extends BaseRepository<UserEntity> {}
