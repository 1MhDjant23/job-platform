import { 
    Controller,
    Post,
    UseGuards
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('upload')
export class UploadController {


    @Post('file')
    @Roles(Role.Employer, Role.JobSeeker)
    @UseGuards(JwtAccessGuard, RolesGuard)
    uploadFile() {

    }
}
