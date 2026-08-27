import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessStrategy } from './strategies/jwt-access.strategies';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategies';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule,
    UsersModule
  ],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
