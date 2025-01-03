import { readFile, writeFile, unlink } from "node:fs";
import { IData } from "../interfaces/media-cloud-manager.interface";
import { InternalServerError } from "../errors/internal-server.error";
// import { Buffer } from "node:buffer";
import { inMemoryDataPath } from "../utils/paths";
import path from "path";
import { Request } from "express";

export class MediaCloudManagerRepository {
  public static async loadDataAfterReadFile(): Promise<IData> {
    return new Promise<IData>((resolve, reject) => {
      readFile(
        inMemoryDataPath,
        'utf8',
        (error, data) => {
          if (error) return reject(new InternalServerError("Erro ao tentar processar os dados!"));
          resolve(JSON.parse(data.toString()))
        });
    });
  }

  public static async writeToFile(message: string, data: IData) {
    return new Promise((resolve, reject) => {
      writeFile(
        inMemoryDataPath,
        JSON.stringify(data, null, 2),
        (error) => {
          if (error) return reject(new InternalServerError(message));
          resolve(data.data);
        }
      );
    });
  }

  public static async deleteFromFile(id: number) {
    return new Promise((resolve, reject) => {
      this.loadDataAfterReadFile().then(data => {
        const filePath = data.data.find(column => column.media_id === id)?.default_image_file;
        const defaultImageFile = filePath?.split(`${process.env.URL}/uploads/`).at(1);
        unlink(path.resolve(__dirname, '../../assets/uploads/' + defaultImageFile), error => {
          if (error) return reject(new InternalServerError(error.message));
          resolve(defaultImageFile);
        })
      }).catch(error => {
        throw error;
      })

    })
  }
}

