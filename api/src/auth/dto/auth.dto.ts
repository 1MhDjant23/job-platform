import { Roles } from '@prisma/client';
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
}
/*******    *********** ******** */
export  class   signUpDto {
    @IsNotEmpty()
    @IsString()
    firstName!: string

    @IsNotEmpty()
    @IsString()
    lastName!: string

    @IsEnum(Roles)
    role!:   Roles

    @IsEmail()
    email!: string

    @IsString()
    @MinLength(8)
    password!: string
}

