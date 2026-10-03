import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt      from 'bcrypt';
import { RefreshToken, Role } from '@prisma/client';
import { UpdateUserDto } from './dto/users.dto';
import { User } from '@prisma/client';

// export type UserWithPassword = User & { passwordHash: string };
// export type UserWithRefreshTokens = UserWithPassword & { refreshTokens: RefreshToken[] };

export interface   SignUpUser {
    firstName: string
    lastName: string
    email: string
    role:   Role
    password: string
}

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}
/*******    *********** ******** */
    async update(userId: string, dto: UpdateUserDto) {
        

    }
/*******    *********** ******** */
    async findUserByEmail(email: string) : Promise<User | null> {
        console.log("Email from user service: ", email);
        const user = await this.prisma.user.findUnique({
            where: { email: email },
            // select: {
            //     id: true, email: true, firstName: true, lastName: true,
            //     role: true, avatarUrl: true, resumeUrl: true,
            //     passwordHash: true
            // }
        });
        if(!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
    
/*******    *********** ******** */
    async findUserById(userId: string) : Promise<User& {refreshTokens: RefreshToken[]} | null> {
        return await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                refreshTokens: true
            }
        });
    }
/*******    *********** ******** */
    async create(credentials: SignUpUser): Promise<User> {
        return await this.prisma.user.create({
            data: {
                email: credentials.email,
                firstName: credentials.firstName,
                lastName: credentials.lastName,
                passwordHash: credentials.password,
                role: credentials.role
            },
            // select: {
            //     id: true, email: true, firstName: true, lastName: true,
            //     role: true, avatarUrl: true, resumeUrl: true
            // }
        });
    }
/*******    *********** ******** */
    async allUsers() {
        return await this.prisma.user.findMany({
            where: {
                role: { not: Role.Admin }
            },
            select: {
                id: true, email: true,
                firstName: true, lastName: true,
                createdAt: true, updatedAt: true,
                role: true
            }
        });
    }
/*******    *********** ******** */
    async delete(userId: string) {

        return await this.prisma.user.delete({
            where: { id: userId },
            select: { id: true }
        })
    }

    // encrypt password
    async encryptPassword(passwordText: string, salt: number) {
        return await bcrypt.hash(passwordText, salt);
    }
}
