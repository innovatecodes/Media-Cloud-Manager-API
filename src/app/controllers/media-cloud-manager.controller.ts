

import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../utils/enums.js";
import { MediaCloudManagerService } from "../services/media-cloud-manager.service.js";

export class MediaCloudManagerController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MediaCloudManagerService.getAll(req, res);
      res.status(StatusCode.OK).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MediaCloudManagerService.search(req, res);
      res.status(StatusCode.OK).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MediaCloudManagerService.getById(
        Number(req.params.id)
      );
      res.status(StatusCode.OK).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public static async save(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MediaCloudManagerService.save(req, res);
      res.status(StatusCode.CREATED).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MediaCloudManagerService.update(Number(req.params.id), req, res);
      res.status(StatusCode.OK).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await MediaCloudManagerService.delete(Number(req.params.id));
      res.status(StatusCode.NO_CONTENT).end();
      return;
    } catch (error) {
      next(error);
    }
  }
}
