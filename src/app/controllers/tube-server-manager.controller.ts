import { Request, Response } from "express";
import { TubeServerManagerService } from "../services/tube-server-manager.service";
import { StatusCode } from "../utils/utils";

export class TubeServerManagerController {
  static async getAllVideos(request: Request, response: Response) {
    try {
      const data = await TubeServerManagerService.getAllVideos();
      response.status(StatusCode.OK).json({ api: data });
      return;
    } catch (error) {
      response.status(StatusCode.INTERNAL_SERVER_ERROR).json(error);
      return;
    }
  }

  static async getVideoByid(request: Request, response: Response) {
    try {
      const video = await TubeServerManagerService.getVideoById(
        Number(request.params.id)
      );
      response.status(StatusCode.OK).json(video /*{ api: {data: video} }*/);
      return;
    } catch (error) {
      if (error instanceof Error) {
        response.status(StatusCode.NOT_FOUND).json({ error: error.message });
        return;
      } else {
        response.status(StatusCode.INTERNAL_SERVER_ERROR).json(error);
        return;
      }
    }
  }

  static async createVideo(request: Request, response: Response) {
    try {
      const data = await TubeServerManagerService.createVideo(request);
      response.status(StatusCode.CREATED).json({ api: data });
      return;
    } catch (error) {
      if (error instanceof Error) {
        response.status(StatusCode.NOT_FOUND).json({ error: error.message });
        return;
      } else {
        response.status(StatusCode.INTERNAL_SERVER_ERROR).json(error);
        return;
      }
    }
  }

  static async updateVideo(request: Request, response: Response) {
    try {
      const data = await TubeServerManagerService.updateVideo(
        Number(request.params.id),
        request
      );
      response.status(StatusCode.OK).json({ api: data });
      return;
    } catch (error) {
      if (error instanceof Error) {
        response.status(StatusCode.NOT_FOUND).json({ error: error.message });
        return;
      } else {
        response.status(StatusCode.INTERNAL_SERVER_ERROR).json(error);
        return;
      }
    }
  }

  static async deleteVideo(request: Request, response: Response) {
    try {
      await TubeServerManagerService.deleteVideo(Number(request.params.id));
      response.status(StatusCode.NO_CONTENT).end();
      return;
    } catch (error) {
      if (error instanceof Error) {
        response.status(StatusCode.NOT_FOUND).json({ error: error.message });
        return;
      } else {
        response.status(StatusCode.INTERNAL_SERVER_ERROR).json(error);
        return;
      }
    }
  }
}
