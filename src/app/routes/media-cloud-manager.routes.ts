import { apiKeyMiddleware } from '../middlewares/api-key.middleware';
import { Request, Response, Router } from "express";
import { uploadMiddleware } from '../middlewares/file-upload.middleware';
import { EndPoint, StatusCode } from '../utils/enums';
import path from 'path';
import { CloudinaryMiddleware } from '../middlewares/cloudinary.middleware';
import { MediaCloudManagerController } from '../controllers/media-cloud-manager.controller';

export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
    res.set('Content-Type', 'text/html');
    const filePath = path.resolve(__dirname, '..', '..', '..', 'public', 'index.html');
    res.status(StatusCode.OK).sendFile(filePath);
})

routes.get(`${EndPoint.API}${EndPoint.MEDIA}`, MediaCloudManagerController.getAllMediaContent);
routes.get(`${EndPoint.API}${EndPoint.MEDIA_BY_ID}`, MediaCloudManagerController.getMediaContentById);
routes.post(`${EndPoint.API}${EndPoint.MEDIA}`, apiKeyMiddleware, uploadMiddleware, CloudinaryMiddleware.insert, MediaCloudManagerController.createMediaContent);
routes.patch(`${EndPoint.API}${EndPoint.MEDIA_BY_ID}`, apiKeyMiddleware, uploadMiddleware, CloudinaryMiddleware.update, MediaCloudManagerController.updatePartialMediaContent);
routes.delete(`${EndPoint.API}${EndPoint.MEDIA_BY_ID}`, apiKeyMiddleware, CloudinaryMiddleware.delete, MediaCloudManagerController.deleteMediaContent);