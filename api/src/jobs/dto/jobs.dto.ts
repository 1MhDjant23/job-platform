import { PartialType } from "@nestjs/swagger"
import { JobStatus, JobType } from "@prisma/client"
import { Type } from "class-transformer"
import { IsDate, IsEnum, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from "class-validator"

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

export class GetJobsQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(JobStatus)
    status?: JobStatus;

    @IsOptional()
    @IsEnum(JobType)
    type?: JobType;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit = 20;
}