import { IsEmail, IsNotEmpty, IsNumber, IsString, IsUUID, MinLength } from "class-validator";

export  class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName!: string;
    
    @IsString()
    @IsNotEmpty()
    lastName!: string

    @IsNotEmpty()
    @IsEmail()
    email!: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password!: string
}

export  class GetUserDto {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    id!: string;
}