import { Role } from '@prisma/client';
import  {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    MinLength,
}   from 'class-validator';


export  class LoginDto {
    @IsEmail()
    email!: string

    @IsString()
    @IsNotEmpty()
    password!: string

    @IsEnum(Role)
    role!:   Role
}
/*******    *********** ******** */
export  class   signUpDto {
    @IsNotEmpty()
    @IsString()
    firstName!: string

    @IsNotEmpty()
    @IsString()
    lastName!: string

    @IsEnum(Role)
    role!:   Role

    @IsEmail()
    email!: string

    @IsString()
    @MinLength(8)
    password!: string
}

