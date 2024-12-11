import { readFile, writeFile } from "fs";
import { formatDate, inMemoryDatabasePath } from "../utils/utils";
import { IData } from "../interfaces/tube-server-manager.interface";

export class TubeServerManagerRepository {
  public static async loadDataAfterReadFile(): Promise<IData> {
    return new Promise((resolve, reject) => {
      readFile(inMemoryDatabasePath, (error, rawDataJSON) => {
        if (error) return reject("Erro ao tentar processar os dados!");
        else resolve(JSON.parse(rawDataJSON.toString()));
      });
    });
  }

  public static async writeToFile(message: string, data: IData) {
    return new Promise((resolve, reject) => {
      writeFile(
        inMemoryDatabasePath,
        JSON.stringify(data, null, 2),
        (error) => {
           // Rejeita com um erro ao tentar escrever no arquivo .JSON
          if (error) return reject({ error: message, timestamp: formatDate() });
          else resolve(data);
        }
      );
    });
  }
}
