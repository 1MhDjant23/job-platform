import { PartialType } from "@nestjs/swagger"
import { JobStatus, JobType } from "@prisma/client"
import { IsDate, IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator"

export  class   CreateJobDto {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    title!:         string

    @IsString()
    @MinLength(100)
    @MaxLength(500)
    description!:   string

    @IsInt()
    @IsOptional()
    salaryMin!:     number

    @IsInt()
    @IsOptional()
    salaryMax!:     number

    @IsEnum(JobStatus)
    @IsOptional()
    status!:        JobStatus

    @IsOptional()
    @IsEnum(JobType)
    type!:          JobType

    @IsOptional()
    @IsDate()
    exiresAt!:      Date
}

export  class UpdateJobDto extends PartialType(CreateJobDto) {}