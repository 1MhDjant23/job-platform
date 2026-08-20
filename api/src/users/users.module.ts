import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  imports: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
