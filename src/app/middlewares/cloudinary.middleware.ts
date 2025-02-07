import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import { loadNodeEnvironment } from '../utils/dotenv.config.js';
import { MediaCloudManagerRepository } from '../repositories/media-cloud-manager.repository.js';
import { IData } from '../interfaces/media-cloud-manager.interface.js';
import { generateRandomFileName } from '../utils/generate-random-file-name.js';
import fs from 'fs/promises';
import { fileTypeFromBuffer } from 'file-type';
import { UnsupportedMediaTypeError } from '../errors/unsupported-media-type.error.js';
import { ContentTooLargeError } from '../errors/content-too-large.error.js';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename); 

loadNodeEnvironment();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryMiddleware {
    public static cloudinaryUtils = (item: UploadApiResponse, res: Response = {} as Response) => {
        cloudinary.url(item.public_id, {
            fetch_format: 'auto',
            quality: 'auto',
            format: 'auto'
        });

        // (res?.locals as UploadApiResponse).public_id = uploadResult.public_id;
        // (res?.locals as UploadApiResponse).secure_url = uploadResult.secure_url;
        Object.defineProperties(res.locals, {
            public_id: { value: item.public_id },
            secure_url: { value: item.secure_url }
        });
    }

    public static async insert(req: Request = {} as Request, res: Response = {} as Response, next: NextFunction = {} as NextFunction): Promise<any> {
        try {
            if (!req.file && !req.body.default_image_file) return next?.();

            let inserted: UploadApiResponse;

            if (req.file) {
                inserted = await CloudinaryMiddleware.uploader(req.file.path);
                Object.defineProperties(res.locals, {
                    inserted: { value: `${inserted.original_filename}.${inserted.format}` }
                })
            } else {
                inserted = await CloudinaryMiddleware.uploader(await CloudinaryMiddleware.uploadBase64Image(req))
                Object.defineProperties(res.locals, {
                    inserted: { value: `${inserted.original_filename}.${inserted.format}` }
                })
            }

            CloudinaryMiddleware.cloudinaryUtils(inserted, res);

            next();
        } catch (error) {
            next?.(error);
        }
    }

    public static async update(req: Request = {} as Request, res: Response = {} as Response, next: NextFunction = {} as NextFunction): Promise<any> {
        try {
            if (!req?.file && !req?.body.default_image_file) return next?.();

            const publicId = await CloudinaryMiddleware.load(req);

            let updated: UploadApiResponse;

            if (req.file) {
                updated = await CloudinaryMiddleware.uploader(req.file.path, publicId, true);
                Object.defineProperties(res.locals, {
                    inserted: { value: `${updated.original_filename}.${updated.format}` }
                })
            } else {
                updated = await CloudinaryMiddleware.uploader(await CloudinaryMiddleware.uploadBase64Image(req), publicId, true);
                Object.defineProperties(res.locals, {
                    inserted: { value: `${updated.original_filename}.${updated.format}` }
                })
            }

            CloudinaryMiddleware.cloudinaryUtils(updated, res);

            next?.();
        } catch (error) {
            next?.(error);
        }
    }

    public static async delete(req: Request = {} as Request, res: Response = {} as Response, next: NextFunction = {} as NextFunction): Promise<any> {
        try {

            if (!req?.params.id) return next?.();

            const publicId = await CloudinaryMiddleware.load(req);

            if (publicId) await cloudinary.uploader.destroy(`uploads/${publicId}`,
                { resource_type: 'image' }).catch(error => {
                    throw error;
                });

            next?.();
        } catch (error) {
            next?.(error);
        }
    }

    private static async load(req: Request) {
        const data = await MediaCloudManagerRepository.loadDataAfterReadFile() as IData;
        return data.data.find(column => Number(column.media_id) === Number(req.params.id))?.temporary_public_id;
    }

    private static uploadBase64Image = async (req: Request) => {
        const encodedFile = (req.body.default_image_file as string);
        let base64: string;
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

        if (encodedFile?.includes(';base64')) base64 = encodedFile.split(';base64,')[1];
        else base64 = encodedFile;

        const decodedBuffer = Buffer.from(base64, 'base64');
        const fileTypeInfo = await fileTypeFromBuffer(decodedBuffer);

        if (!fileTypeInfo?.mime.startsWith('image/')) throw new UnsupportedMediaTypeError(`Apenas imagens são permitidas!`);
        if (!allowedExtensions?.includes(fileTypeInfo.ext)) throw new Error(`Extensão ${fileTypeInfo.ext} não permitida! Extensões válidas: ${allowedExtensions.join(', ')}`);
        if (decodedBuffer.byteLength > 2 * 1024 * 1024) throw new ContentTooLargeError('Falha no upload, o tamanho máximo permitido para upload é de 2 MB!');

        const filePath = path.join(__dirname, `../../assets/uploads/${generateRandomFileName('default_image_file')}.${fileTypeInfo?.ext}`);
        await fs.writeFile(filePath, decodedBuffer as Buffer);

        return filePath;
    }

    public static uploader = async (filePath: string, publicId?: string, overwrite?: boolean) => {
        return await cloudinary.uploader.upload(filePath, {
            public_id: publicId,
            overwrite: overwrite,
            resource_type: 'image',
            folder: 'uploads'
        }).catch(error => {
            throw error;
        });
    }
}