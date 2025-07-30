import { Module } from '@nestjs/common';
import { ProfileService } from './services/profile.service';

@Module({
    providers: [ProfileService],
    exports: [ProfileService],
})
export class ProfileModule { }