import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt      from 'bcrypt';
import { RefreshToken, Role } from '@prisma/client';

interface User {
    id: string
    email: string
    passwordHash: string
    firstName: string
    createdAt: Date
    lastName: string
    role: Role
    updatedAt: Date
}

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
    async findUserByEmail(email: string) : Promise<User | null> {
        console.log("Email from user service: ", email);
        return await this.prisma.user.findUnique({
            where: { email: email }
        });
    }
/*******    *********** ******** */
    async findUserById(userId: string) : Promise<User& {refreshTokens: RefreshToken[]} | null> {
        return await this.prisma.user.findUnique({
            where: { id: userId },
            include: {refreshTokens: true}
        });
    }
/*******    *********** ******** */
    async create(credentials: SignUpUser) {
        await this.prisma.user.create({
            data: {
                email: credentials.email,
                firstName: credentials.firstName,
                lastName: credentials.lastName,
                passwordHash: credentials.password,
                role: credentials.role
            }
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


    // Get All users
    // async findAll() {
    //     return this.prisma.user.findMany({
    //         select: {
    //             id: true, firstName: true, lastName: true, email: true, createdAt: true
    //         }
    //     })
    // }
    // get one user
    // async findOne(userId: string) {
    //     const   user = await this.prisma.user.findFirst({
    //         where: { id: userId },
    //         select: { id: true, firstName: true, lastName: true, email: true,
    //             createdAt: true, updatedAt: true
    //          }
    //     });
    //     if(user === null) {
    //         throw new NotFoundException();
    //     }
    //     return user;
    // }
    // Delete one user
    // async delete(userId: string) {

    //     const   isExist = await this.prisma.user.findFirst({
    //         where: { id: userId },
    //         select: { id: true }
    //     });
    //     if(isExist === null) {
    //         throw new NotFoundException('User not exist');
    //     }
    //     await this.prisma.user.delete({
    //         where: { id: userId }
    //     });
    //     return isExist;
    // }
    // encrypt password
    async encryptPassword(passwordText: string, salt: number) {
        return await bcrypt.hash(passwordText, salt);
    }
}
