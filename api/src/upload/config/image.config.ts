import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
import { extname } from "path";
import {BadRequestException} from '@nestjs/common';
import { randomUUID } from "crypto";

export  type Folder = 'logos' | 'avatars'| 'resumes';

export  function imageMulterConfig(folder: Folder) : MulterOptions {
    return {
        storage: diskStorage({
                destination:   `./uploads/${folder}`,
                filename: (req, file, cb) => {
                    cb(null, `${randomUUID()}-${extname(file.originalname.toLowerCase())}`)
                }
            }),
        limits: {fileSize: 2 * 1024 * 1024},
        fileFilter: (req, file, cb) => {
            const   allowed = ['image/jpeg', 'image/png', 'image/webp'];
            if(!allowed.includes(file.mimetype)) {
                return cb(new BadRequestException("Only jpeg, png, webp are allowed"), false);
            }
            cb(null, true);
        }
    }
}