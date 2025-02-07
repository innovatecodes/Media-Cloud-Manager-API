import { readFile, writeFile, unlink } from "node:fs";
import { IData } from "../interfaces/media-cloud-manager.interface.js";
import { InternalServerError } from "../errors/internal-server.error.js";
import { inMemoryDataPath } from "../utils/paths.js";
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadNodeEnvironment } from "../utils/dotenv.config.js";

import { Request, Response } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

loadNodeEnvironment();

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
          resolve(data);
        }
      );
    });
  }

  public static async deleteFromFile(id: number, req: Request = {} as Request, res: Response = {} as Response) {
    return new Promise((resolve, reject) => {
      this.loadDataAfterReadFile().then(data => {
        const filePath = data.data.find(column => column.media_id === id)?.original_filename;
        unlink(path.resolve(__dirname, `../../assets/uploads/${filePath}`), error => {
          if (error) return reject(new InternalServerError(error.message));
          resolve(filePath);
        })
      }).catch(error => {
        throw error;
      })

    })
  }
}

