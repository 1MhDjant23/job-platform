import { Transform } from 'class-transformer'
import  {
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    MinLength
}   from    'class-validator'

export  class   CreateCompanyDto {
    @IsString()
    @MinLength(2)
    @MaxLength(20)
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