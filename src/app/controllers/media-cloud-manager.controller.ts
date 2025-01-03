import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../utils/enums";
import { MediaCloudManagerService } from "../services/media-cloud-manager.service";

export class MediaCloudManagerController {
  public static async getAllMediaContent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MediaCloudManagerService.getAllMediaContent(req, res);
      res.status(StatusCode.OK).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public static async getMediaContentById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MediaCloudManagerService.getMediaContentById(
        Number(req.params.id)
      );
      res.status(StatusCode.OK).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public static async createMediaContent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MediaCloudManagerService.createMediaContent(req, res);
      res.status(StatusCode.CREATED).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public static async updatePartialMediaContent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MediaCloudManagerService.updatePartialMediaContent(Number(req.params.id), req, res);
      res.status(StatusCode.OK).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public static async deleteMediaContent(req: Request, res: Response, next: NextFunction) {
    try {
      await MediaCloudManagerService.deleteMediaContent(Number(req.params.id));
      res.status(StatusCode.NO_CONTENT).end();
      return;
    } catch (error) {
      next(error);
    }
  }
}
