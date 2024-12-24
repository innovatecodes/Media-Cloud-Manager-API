import { apiKeyMiddleware } from '../middlewares/api-key.middleware';
import { Request, Response, Router } from "express";
import { TubeServerManagerController } from "../controllers/tube-server-manager.controller";
import { uploadMiddleware } from '../middlewares/file-upload.middleware';
import { cloudinaryFnAsMiddleware } from '../middlewares/cloudinary.middleware';
import { EndPoint, StatusCode } from '../utils/enums';
import path from 'path';
export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
    res.set('Content-Type', 'text/html');
    const filePath = path.resolve(__dirname, '..', '..', '..', 'public', 'index.html');
    res.status(StatusCode.OK).sendFile(filePath);
})

routes.get(`${EndPoint.API}v1${EndPoint.MEDIA}`, TubeServerManagerController.getAll);
routes.get(`${EndPoint.API}v1${EndPoint.MEDIA_BY_ID}`, TubeServerManagerController.getMediaContentById);
routes.post(`${EndPoint.API}v1${EndPoint.MEDIA}`, apiKeyMiddleware, uploadMiddleware, cloudinaryFnAsMiddleware, TubeServerManagerController.createMediaContent);
routes.put(`${EndPoint.API}v1${EndPoint.MEDIA_BY_ID}`, apiKeyMiddleware, uploadMiddleware, cloudinaryFnAsMiddleware, TubeServerManagerController.updateMediaContent);
routes.patch(`${EndPoint.API}v1${EndPoint.MEDIA_BY_ID}`, apiKeyMiddleware, uploadMiddleware, cloudinaryFnAsMiddleware, TubeServerManagerController.updateImageFile);
routes.delete(`${EndPoint.API}v1${EndPoint.MEDIA_BY_ID}`, apiKeyMiddleware, TubeServerManagerController.deleteMediaContent);
