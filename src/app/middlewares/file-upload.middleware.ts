import multer, { FileFilterCallback, MulterError } from "multer";
import { NextFunction, Request, Response } from 'express';
import path from "path";
import { ContentTooLargeError } from "../errors/content-too-large.error";
import { UnsupportedMediaTypeError } from "../errors/unsupported-media-type.error";
import { storage } from "../utils/disk-storage";

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const allowedExtensions = ['.jpg', '.png', '.webp'];

    // Verifica se o tipo MIME do arquivo começa com "image/" (indica que é uma imagem)
    if (!file.mimetype.startsWith('image/')) {
        const error = new UnsupportedMediaTypeError(`Tipo MIME inválido: ${file.mimetype}. Apenas imagens são permitidas!`);
        error.name = 'InvalidMimeType'; // Atribui o nome de erro para identificá-lo facilmente
        return callback(error); // Retorna erro se o tipo MIME não for imagem
    }

    // Verifica se a extensão do arquivo é uma das permitidas
    if (!allowedExtensions.includes(path.extname(file.originalname.toLowerCase()))) {
        const error = new MulterError('LIMIT_UNEXPECTED_FILE');
        error.message = `Extensão ${path.extname(file.originalname.toLowerCase())} não permitida! Extensões válidas: ${allowedExtensions.join(', ')}`;
        return callback(error);
    }

    callback(null, true);
}

// Configuração do multer com armazenamento, limites e filtro de arquivos
export const upload = multer({
    storage, // Configuração de armazenamento personalizada importada
    limits: { fileSize: 3 * 1024 * 1024, }, // Limite de tamanho do arquivo: 3MB
    fileFilter // Função para validar o tipo e extensão do arquivo
}).single('default_image_file'); // Define o nome do campo como 'default_image_file'

export const uploadMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Middleware para processar o upload de arquivo
    upload(req, res, (error: MulterError | any) => {
        try {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') throw new ContentTooLargeError('Falha no upload. O tamanho máximo permitido para upload é de 3 MB!');
                if (error.code === 'LIMIT_UNEXPECTED_FILE') throw error; // Lança erro para arquivo inesperado
            }

            // Se o erro for relacionado ao tipo MIME, lança um erro específico
            if (error?.name === 'InvalidMimeType')
                throw error;

            if (!req.file)
                return next();
            else return next();
        } catch (error) {
            next(error); // Passa o erro para o próximo middleware de erro
        }
    })
};
