import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt      from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    // create user (Sign-Up)
    async create(payload: CreateUserDto) {
        const   isExist = await this.prisma.user.findUnique({
            where: { email: payload.email }
        });
        if(isExist) {
            throw new ConflictException('Email already exists');
        }
        const   hash = await this.encryptPassword(payload.password, 10);

        return this.prisma.user.create({
            data:
            {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email, 
                passwordHash: hash
            },
            select: { email: true, id: true }
        })
    }
    // Get All users
    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true, firstName: true, lastName: true, email: true, createdAt: true
            }
        })
    }
    // get one user
    async findOne(userId: string) {
        const   user = await this.prisma.user.findFirst({
            where: { id: userId },
            select: { id: true, firstName: true, lastName: true, email: true,
                createdAt: true, updatedAt: true
             }
        });
        if(user === null) {
            throw new NotFoundException();
        }
        return user;
    }
    // Delete one user
    async delete(userId: string) {

        const   isExist = await this.prisma.user.findFirst({
            where: { id: userId },
            select: { id: true }
        });
        if(isExist === null) {
            throw new NotFoundException('User not exist');
        }
        await this.prisma.user.delete({
            where: { id: userId }
        });
        return isExist;
    }
    // encrypt password
    async encryptPassword(passwordText: string, salt: number) {
        return await bcrypt.hash(passwordText, salt);
    }
}
