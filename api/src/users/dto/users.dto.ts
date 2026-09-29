import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsUUID, MinLength } from "class-validator";

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

export  class UpdateUserDto {
    @IsOptional()
    @IsNotEmpty()
    @IsUrl()
    resumUrl!: string

    @IsOptional()
    @IsNotEmpty()
    @IsUrl()
    avatarUrl!: string
}

export  class GetUserDto {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    id!: string;
}