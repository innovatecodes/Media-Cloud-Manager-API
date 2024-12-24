import { NextFunction, Request, Response } from "express";
import { TubeServerManagerService } from "../services/tube-server-manager.service";
import { StatusCode } from "../utils/enums";

export class TubeServerManagerController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await TubeServerManagerService.getAll(req, res);
      res.status(StatusCode.OK).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public static async getMediaContentById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await TubeServerManagerService.getMediaContentById(
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
      const data = await TubeServerManagerService.createMediaContent(req, res);
      res.status(StatusCode.CREATED).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public static async updateMediaContent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await TubeServerManagerService.updateMediaContent(Number(req.params.id), req, res);
      res.status(StatusCode.OK).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public static async updateImageFile(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await TubeServerManagerService.updateImageFile(Number(req.params.id), req, res);
      res.status(StatusCode.OK).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  public static async deleteMediaContent(req: Request, res: Response, next: NextFunction) {
    try {
      await TubeServerManagerService.deleteMediaContent(Number(req.params.id));
      res.status(StatusCode.NO_CONTENT).end();
      return;
    } catch (error) {
      next(error);
    }
  }
}
