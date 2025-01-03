import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import { loadNodeEnvironment } from '../utils/dotenv.config';
import { MediaCloudManagerRepository } from '../repositories/media-cloud-manager.repository';
import { IData } from '../interfaces/media-cloud-manager.interface';

loadNodeEnvironment();

// Configura as credenciais do Cloudinary usando variáveis de ambiente
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryMiddleware {
    public static async load(req: Request) {
        const data = await MediaCloudManagerRepository.loadDataAfterReadFile() as IData;
        return data.data.find(column => Number(column.media_id) === Number(req.params.id))?.temporary_public_id;
    }

    public static cloudinaryUtils = (item: UploadApiResponse, res: Response = {} as Response) => {
        cloudinary.url(item.public_id, {
            fetch_format: 'auto',
            quality: 'auto',
            format: 'auto',
            url_suffix: 'tube-server-manager'  // Sufixo para melhorar a URL
        });

        // (res?.locals as UploadApiResponse).public_id = uploadResult.public_id;
        // (res?.locals as UploadApiResponse).secure_url = uploadResult.secure_url;
        Object.defineProperties(res.locals, {
            public_id: { value: item.public_id },
            secure_url: { value: item.secure_url }
        });
    }

    public static async insert(req?: Request, res?: Response, next?: NextFunction): Promise<any> {
        try {
            if (!req?.file) return next?.();

            await CloudinaryMiddleware.load(req);

            const insert = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'image',
                folder: 'uploads' // Define a pasta no Cloudinary onde o arquivo será armazenado
            }).catch(error => {
                throw error;
            });

            CloudinaryMiddleware.cloudinaryUtils(insert, res);

            next?.();
        } catch (error) {
            next?.(error);
        }
    }

    public static async update(req?: Request, res?: Response, next?: NextFunction): Promise<any> {
        try {
            if (!req?.file) return next?.();

            const publicId = await CloudinaryMiddleware.load(req);
            const update = await cloudinary.uploader.upload(req.file.path, {
                public_id: publicId,
                overwrite: true,
                resource_type: 'image',
                folder: 'uploads'  
            }).catch(error => {
                throw error;
            });

            CloudinaryMiddleware.cloudinaryUtils(update, res);

            next?.();
        } catch (error) {
            next?.(error);
        }
    }

    public static async delete(req?: Request, res?: Response, next?: NextFunction): Promise<any> {
        try {

            if (!req?.params.id) return next?.();

            const publicId = await CloudinaryMiddleware.load(req);

            if (publicId) await cloudinary.uploader.destroy(`uploads/${publicId}`,
                { resource_type: 'image' }).catch(error => {
                    throw error;
                });

            next?.();
        } catch (error) {
            console.error('Erro ao remover imagem do Cloudinary:', error);
            next?.(error);
        }
    }
}