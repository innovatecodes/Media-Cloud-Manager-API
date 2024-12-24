import fs, { readFile, writeFile,  writeFileSync} from "fs";
import { IData } from "../interfaces/tube-server-manager.interface";
import { InternalServerError } from "../errors/internal-server.error";
import { Buffer } from "node:buffer";
import { inMemoryDataPath } from "../utils/paths";

export class TubeServerManagerRepository {

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

  // public static convertBase64ToFile = (base64Str: string, filePath: string) => {
  //   const buffer = Buffer.from(base64Str, 'base64');
  //   fs.writeFileSync(filePath, buffer);
  //   return filePath;
  // }
}



