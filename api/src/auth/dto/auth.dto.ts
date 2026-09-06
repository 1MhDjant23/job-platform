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

    // @IsEnum(Role)
    // role!:   Role
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


//"accessToken": 
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1YTlhYTkzZi00NjZjLTRiMTktOGQ1Yi1kNGM2YWQxODc3OGQiLCJ0eXBlIjoiYWNjZXNzIiwicm9sZSI6IkVtcGxveWVyIiwiaWF0IjoxNzg4Mjg2NDAwLCJleHAiOjE3ODgyODY4MjB9.9spi3XP-SRAkt_zJwh3QymGVEb5Fx-ls8txH6Htb3k4"

//refreshtoken
// ""

//*********** */
