
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import { loadNodeEnvironment } from '../utils/dotenv.config';
import { TubeServerManagerRepository } from '../repositories/tube-server-manager.repository';
import { IData } from '../interfaces/tube-server-manager.interface';

loadNodeEnvironment();

// Configura as credenciais do Cloudinary usando variáveis de ambiente
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware para realizar o upload da imagem para o Cloudinary
export const cloudinaryFnAsMiddleware = async (req?: Request, res?: Response, next?: NextFunction): Promise<any> => {
    try {
        // Se não houver arquivo enviado, pula para o próximo middleware
        if (!req?.file) return next?.();

        const data = await TubeServerManagerRepository.loadDataAfterReadFile() as IData;
        const publicId = data.data.find(column => Number(column.content_id) === Number(req.params.id))?.temporary_public_id;

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: publicId?.replace('uploads/', ''),
            overwrite: true,
            resource_type: 'image',
            folder: 'uploads'  // Define a pasta no Cloudinary onde o arquivo será armazenado
        }).catch(error => {
            throw error;
        });

        // Gera a URL da imagem otimizada para acesso
        cloudinary.url(uploadResult.public_id, {
            fetch_format: 'auto',
            quality: 'auto',
            format: 'auto',
            url_suffix: 'tube-server-manager'  // Sufixo para melhorar a URL
        });

        // (res?.locals as UploadApiResponse).public_id = uploadResult.public_id;
        // (res?.locals as UploadApiResponse).secure_url = uploadResult.secure_url;
        Object.defineProperties(res?.locals, {
            public_id: { value: uploadResult.public_id },
            secure_url: { value: uploadResult.secure_url }
        });

        next?.();
    } catch (error) {
        next?.(error);
    }
}
