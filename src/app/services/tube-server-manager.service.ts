import { formatDate, inMemoryDatabasePath } from "../utils/utils";
import { readFile, writeFile } from "fs";
import { Request } from "express";
import { IData } from "../interfaces/tube-server-manager.interface";

export class TubeServerManagerService {
  static async getAllVideos() {
    return await this.loadDataAfterReadFile();
  }

  static async getVideoById(id: number) {
    const data = (await this.loadDataAfterReadFile()) as IData;
    const video = data.data.find((video) => video.video_id === id);
    if (!video) throw new Error("Video não encontrado!");
    return video;
  }

  static async createVideo(request: Request) {
    const data = (await this.loadDataAfterReadFile()) as IData;
    this.validateRequest(request);

    if (!data.data) data.data = [];
    
    request.body.posted_at = formatDate();

    data.data.push({
      video_id: data.data.at(-1)?.video_id
        ? Number(data.data.at(-1)?.video_id) + 1
        : 1,
      ...request.body,
    });

    await this.writeToFile("Erro ao tentar salvar os dados!", data);
    return data;
  }

  static async updateVideo(id: number, request: Request) {
    const { categories, video_description, title, link, image_url } =
      request.body;
    const data = (await this.loadDataAfterReadFile()) as IData;
    const indexOfVideo = data.data.findIndex((video) => video.video_id === id);

    if (indexOfVideo === -1) throw new Error("Video não encontrado!");

    this.validateRequest(request);

    data.data[indexOfVideo].categories = categories;
    data.data[indexOfVideo].video_description = video_description;
    data.data[indexOfVideo].title = title;
    data.data[indexOfVideo].updated_at = formatDate();
    data.data[indexOfVideo].link = link;
    data.data[indexOfVideo].image_url = image_url;

    await this.writeToFile("Erro ao tentar atualizar os dados!", data);
    return data;
  }

  static async deleteVideo(id: number) {
    const data = (await this.loadDataAfterReadFile()) as IData;
    const indexOfVideo = data?.data.findIndex((video) => video.video_id === id);

    if (indexOfVideo === -1) throw new Error("Video não encontrado!");

    data.data.splice(indexOfVideo, 1);
    await this.writeToFile("Erro ao tentar excluir os dados!", data);
    return data;
  }

  private static async loadDataAfterReadFile(): Promise<IData> {
    return new Promise((resolve, reject) => {
      readFile(inMemoryDatabasePath, (error, rawDataJSON) => {
        if (error) return reject("Erro ao tentar processar os dados!");
        else resolve(JSON.parse(rawDataJSON.toString()));
      });
    });
  }

  private static validateRequest(request: Request) {
    if (!request.body.categories) throw Error("Selecione uma categoria!");
    if (!request.body.video_description) throw Error("Adicione uma descrição!");
    if (!request.body.title) throw Error("Título obrigatório!");
    if (!request.body.link) throw Error("Link obrigatório!");
  }

  private static async writeToFile(message: string, data: IData) {
    return new Promise((resolve, reject) => {
      try {
        writeFile(
          inMemoryDatabasePath,
          JSON.stringify(data, null, 2),
          (error) => {
            if (error) {
              return reject({ error: message, timestamp: formatDate() });
            }
            resolve(data);
          }
        );
      } catch (error) {
        return reject(error);
      }
    });
  }
}
