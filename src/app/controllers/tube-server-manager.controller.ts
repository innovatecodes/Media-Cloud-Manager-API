import { Request, Response } from "express";
import {
  formatDate,
  inMemoryDatabasePath,
  sendStatusCodeMessage,
  StatusCode,
} from "../utils/utils";
import { ITubeServerManagerApi } from "../interfaces/tube-server-manager.interface";
import fs from "fs";

let bodyData!: ITubeServerManagerApi;

export class TubeServerManagerController {
  static getAllVideos(request: Request, response: Response) {
    fs.readFile(inMemoryDatabasePath, (error, data) => {
      if (error) {
        response.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          error: "Erro ao tentar ler os dados do arquivo!",
          timestamp: formatDate(),
        });
      } else {
        bodyData = JSON.parse(data.toString());
        response.status(StatusCode.OK).json({ api: bodyData });
      }
    });
  }

  static getVideoByid(request: Request, response: Response) {
    fs.readFile(inMemoryDatabasePath, (error, data) => {
      if (error)
        response.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          error: "Erro ao tentar ler os dados do arquivo!",
          timestamp: formatDate(),
        });

      try {
        bodyData = JSON.parse(data.toString());

        const video = bodyData.videos.data.find(
          (video) => video.video_id === parseInt(request.params.id)
        );

        if (!video) throw new Error("Video não encontrado!");

        response.status(StatusCode.OK).json({ api: video });
      } catch (error) {
        if (error instanceof Error)
          response.status(StatusCode.NOT_FOUND).json({ error: error.message });
        else
          response.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            error: sendStatusCodeMessage(StatusCode.INTERNAL_SERVER_ERROR),
          });
      }
    });
  }

  static createVideo(request: Request, response: Response) {
    const { categories, video_description, title, link } = request.body;

    try {
      if (!categories) throw Error("Selecione uma categoria!");
      if (!video_description) throw Error("Adicione uma descrição!");
      if (!title) throw Error("Título obrigatório!");
      if (!link) throw Error("Link obrigatório!");

      if (bodyData) {
        if (!bodyData.videos?.data) bodyData.videos = { data: [] };

        bodyData.videos.data.push({
          video_id: bodyData.videos.data.at(-1)?.video_id
            ? bodyData.videos.data.length + 1
            : 1,
          ...request.body,
        });
      }

      fs.writeFile(
        inMemoryDatabasePath,
        JSON.stringify(bodyData, null, 2),
        (error) => {
          if (error) {
            return response.status(StatusCode.INTERNAL_SERVER_ERROR).json({
              error: sendStatusCodeMessage(StatusCode.INTERNAL_SERVER_ERROR),
            });
          }
          return response.status(StatusCode.CREATED).json({ api: bodyData });
        }
      );
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error)
        response.status(StatusCode.BAD_REQUEST).send({ error: error.message });
      else
        response.status(StatusCode.INTERNAL_SERVER_ERROR).send({
          error: sendStatusCodeMessage(StatusCode.INTERNAL_SERVER_ERROR),
        });
    }
  }
}
