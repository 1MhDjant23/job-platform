import { Injectable } from '@nestjs/common';
import { Folder } from './config/image.config';
import { join } from 'path';
import { unlink } from 'node:fs';

@Injectable()
export class UploadService {

    getFileUrl(folder: Folder, filename: string): string {
        return `uploads/${folder}/${filename}`;
    }

    deleteFile(fileUrl: string | null) : void {
        if(!fileUrl || fileUrl.startsWith('http')) {
            return ;
        }

        const   fullPath = join(process.cwd(), fileUrl.startsWith('.') ? fileUrl.slice(1) : fileUrl);
        try {
            unlink(fullPath, (err) => {
                if(err) {
                    throw err;
                }
            });
        } catch {}
    }
}
