import { PartialType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import  {
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    MinLength
}   from    'class-validator'
// import  {PartialType}   from    '@nestjs/swager';
export  class   CreateCompanyDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @Transform(({value}) => value?.trim())
    name!: string

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description!: string

    @IsOptional()
    @IsUrl()
    website!: string

    @IsOptional()
    @IsString()
    @MaxLength(100)
    location!: string

    @IsOptional()
    @IsUrl()
    logoUrl!: string
}

// i will update it to be extended from PartialType(CreateCompanyDto)
export  class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
    // @IsOptional()
    // @IsString()
    // @MinLength(2)
    // @MaxLength(100)
    // @Transform(({value}) => value?.trim())
    // name!:  string

    // @IsOptional()
    // @IsString()
    // @MaxLength(500)
    // description!: string


    // @IsOptional()
    // @IsUrl()
    // website!: string

    // @IsOptional()
    // @IsString()
    // @MaxLength(100)
    // location!: string

    // @IsOptional()
    // @IsUrl()
    // logoUrl!: string
}