import { Request, Response } from "express";
import { TubeServerManagerService } from "../services/tube-server-manager.service";
import { StatusCode } from "../utils/utils";

export class TubeServerManagerController {
  static async getAllVideos(req: Request, res: Response) {
    try {
      const data = await TubeServerManagerService.getAllVideos();
      res.status(StatusCode.OK).json({ api: data });
      return;
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json(error);
      return;
    }
  }

  static async getVideoByid(req: Request, res: Response) {
    try {
      const video = await TubeServerManagerService.getVideoById(
        Number(req.params.id)
      );
      res.status(StatusCode.OK).json(video /*{ api: {data: video} }*/);
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCode.NOT_FOUND).json({ error: error.message });
        return;
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json(error);
        return;
      }
    }
  }

  static async createVideo(req: Request, res: Response) {
    try {
      const data = await TubeServerManagerService.createVideo(req);
      res.status(StatusCode.CREATED).json({ api: data });
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCode.NOT_FOUND).json({ error: error.message });
        return;
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json(error);
        return;
      }
    }
  }

  static async updateVideo(req: Request, res: Response) {
    try {
      const data = await TubeServerManagerService.updateVideo(
        Number(req.params.id),
        req
      );
      res.status(StatusCode.OK).json({ api: data });
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCode.NOT_FOUND).json({ error: error.message });
        return;
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json(error);
        return;
      }
    }
  }

  static async deleteVideo(req: Request, res: Response) {
    try {
      await TubeServerManagerService.deleteVideo(Number(req.params.id));
      res.status(StatusCode.NO_CONTENT).end();
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCode.NOT_FOUND).json({ error: error.message });
        return;
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json(error);
        return;
      }
    }
  }

  static async search(req: Request, res: Response) {
    try {
      const filtered = await TubeServerManagerService.search(req, res);
      res.status(StatusCode.OK).json(filtered);
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCode.NOT_FOUND).json({ error: error.message });
        return;
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json(error);
        return;
      }
    }
  }
}
