import { 
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { imageMulterConfig } from './config/image.config';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/common/types/users.types';
import { UploadService } from './upload.service';
import { resumeMulterConfig } from './config/resume.config';

@Controller('upload')
export class UploadController {
    constructor(private readonly uplaodService: UploadService) {}

    @Post('logo')
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('logo', imageMulterConfig('logos')))
    uploadLogo(
        @CurrentUser() user: CurrentUserPayload,
        @UploadedFile() file: Express.Multer.File
    ) {
        if(!file) {
            throw new BadRequestException("No file provided");
        }
        return {url: this.uplaodService.getFileUrl('logos', file.filename)}
    }

    @Post('resume')
    @Roles(Role.JobSeeker)
    @UseGuards(JwtAccessGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('resume', resumeMulterConfig))
    uploadResume(
        @UploadedFile() file: Express.Multer.File
    ) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }
        return {url: this.uplaodService.getFileUrl('resumes', file.filename)};
    }
}
