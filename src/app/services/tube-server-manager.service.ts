import {
  formatDate,
  HttpMethod,
  inMemoryDatabasePath,
  StatusCode,
} from "../utils/utils";
import { readFile, writeFile } from "fs";
import { Request, Response } from "express";
import { IData } from "../interfaces/tube-server-manager.interface";

export class TubeServerManagerService {
  static async getAllVideos() {
    return await this.loadDataAfterReadFile();
  }

  static async search(req: Request, res: Response) {
    const data = (await this.loadDataAfterReadFile()) as IData;
    const categoryName = (req.query?.category as string)?.toLowerCase();
    const filtered = data.data.filter((q) =>q.categories.includes(categoryName));

    if (Object.keys(req.query).length === 0 || categoryName === "") throw new Error("Forneça uma categoria!");
    if (filtered.length === 0 && Object.keys(req.query).includes('category')) throw new Error(`${filtered.length} resultado para ${categoryName}!`);
    if (filtered.length === 0 && !Object.keys(req.query).includes('category'))throw new Error("Parâmetro \"category\" ausente!");

    await this.writeToFile("Erro ao tentar buscar pela categoria!", data);
    return filtered;
  }

  static async getVideoById(id: number) {
    const data = (await this.loadDataAfterReadFile()) as IData;
    const video = data.data.find((video) => video.video_id === id);
    if (!video) throw new Error("Video não encontrado!");
    return video;
  }

  static async createVideo(req: Request) {
    const data = (await this.loadDataAfterReadFile()) as IData;
    this.validateRequest(req);

    if (!data.data) data.data = [];

    req.body.posted_at = formatDate();

    data.data.push({
      video_id: data.data.at(-1)?.video_id
        ? Number(data.data.at(-1)?.video_id) + 1
        : 1,
      ...req.body,
    });

    await this.writeToFile("Erro ao tentar salvar os dados!", data);
    return data;
  }

  static async updateVideo(id: number, req: Request) {
    const { categories, video_description, title, link, image_url } = req.body;
    const data = (await this.loadDataAfterReadFile()) as IData;
    const indexOfVideo = data.data.findIndex((video) => video.video_id === id);

    if (indexOfVideo === -1) throw new Error("Video não encontrado!");

    this.validateRequest(req);

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

  private static async loadDataAfterReadFile(): Promise<any> {
    return new Promise((resolve, reject) => {
      readFile(inMemoryDatabasePath, (error, rawDataJSON) => {
        if (error) return reject("Erro ao tentar processar os dados!");
        else resolve(JSON.parse(rawDataJSON.toString()));
      });
    });
  }

  private static validateRequest(req: Request) {
    if (!req.body.categories) throw Error("Selecione uma categoria!");
    if (!req.body.video_description) throw Error("Adicione uma descrição!");
    if (!req.body.title) throw Error("Título obrigatório!");
    if (!req.body.link) throw Error("Link obrigatório!");
  }

  private static async writeToFile(message: string, data: IData) {
    return new Promise((resolve, reject) => {
      writeFile(
        inMemoryDatabasePath,
        JSON.stringify(data, null, 2),
        (error) => {
          if (error) {
            return reject({ error: message, timestamp: formatDate() }); // Rejeita com um erro ao tentar escrever no arquivo .JSON
          }
          resolve(data);
        }
      );
    });
  }
}
