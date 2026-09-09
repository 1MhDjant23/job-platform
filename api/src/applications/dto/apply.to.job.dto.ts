import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

export  class ApplyToJobDto {
    @IsNotEmpty()
    @IsUUID()
    jobId!: string

    @IsOptional()
    @IsString()
    coverLettre!: string
}