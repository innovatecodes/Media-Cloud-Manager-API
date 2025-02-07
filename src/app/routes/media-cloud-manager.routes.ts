import { apiKeyMiddleware } from '../middlewares/api-key.middleware.js';
import { Request, Response, Router } from "express";
import { uploadMiddleware } from '../middlewares/file-upload.middleware.js';
import { ContentType, EndPoint, StatusCode } from '../utils/enums.js';;
import { CloudinaryMiddleware } from '../middlewares/cloudinary.middleware.js';
import { MediaCloudManagerController } from '../controllers/media-cloud-manager.controller.js';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const routes = Router();

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename);

routes.get("/", (req: Request, res: Response) => {
    res.setHeader('Content-Type', ContentType.HTML);
    const filePath = path.join(__dirname, '..', '..', '..', 'public', 'index.html');
    res.status(StatusCode.OK).sendFile(filePath);
})

routes.get(`${EndPoint.MEDIA}`, MediaCloudManagerController.getAll);
routes.get(`${EndPoint.SEARCH}`, MediaCloudManagerController.search);
routes.get(`${EndPoint.MEDIA_BY_ID}`, MediaCloudManagerController.getById);
routes.post(`${EndPoint.MEDIA}`, apiKeyMiddleware, uploadMiddleware, CloudinaryMiddleware.insert, MediaCloudManagerController.save);
routes.put(`${EndPoint.MEDIA_BY_ID}`, apiKeyMiddleware, uploadMiddleware, CloudinaryMiddleware.update, MediaCloudManagerController.update);
routes.delete(`${EndPoint.MEDIA_BY_ID}`, apiKeyMiddleware, CloudinaryMiddleware.delete, MediaCloudManagerController.delete);