import { BadRequestException } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { randomUUID } from "crypto";
import { diskStorage } from "multer";
import { extname } from "path";

export  const   resumeMulterConfig: MulterOptions = {
    storage: diskStorage({
        destination: './uploads/resumes',
        filename: (_req, file, cb) => {
            cb(null, `${randomUUID}-${extname(file.originalname).toLowerCase()}`)
        }
    }),
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        const   allowed = ['application/pdf'];
        if (!allowed.includes(file.mimetype)) {
            return cb(new BadRequestException("Only PDF files are allowed"), false);
        }
        cb(null, true);
    }
}   