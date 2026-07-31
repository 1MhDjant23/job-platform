import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { CreateUserDto, GetUserDto } from './dto/create-user.dto';

@Controller('u')
export class UsersController {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}
  // Create new user
  @Post('sign-up')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
  // Get all users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  // Get one user
  @Get(':id')
  findOne(@Param() params: GetUserDto) {
    console.log(`his type: ${typeof params.id}`);
    return this.usersService.findOne(params.id);
  }
  // remove one user
  @Delete(':id')
  delete(@Param() params: GetUserDto) {
    console.log('Deleting User');
    return this.usersService.delete(params.id); 
  }

}
