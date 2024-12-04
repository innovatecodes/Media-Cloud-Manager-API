import express, { Request, Response } from "express";
import cors from "cors";
import {
  apiVersion,
  corsOptions,
  formatDate,
  sendStatusCodeMessage,
  inMemoryDatabasePath,
  StatusCode,
} from "./app/utils/utils";
import fs from "fs";
import { ITubeServerManagerApi } from "./app/interfaces/tube-server-manager.interface";

export const app = express();

/**
 * Middleware que faz o parsing do corpo da requisição no formato JSON.
 * Isso permite que o Express converta automaticamente o corpo da requisição
 * em um objeto JavaScript acessível via `req.body`.
 * Utilizado quando o corpo da requisição tem o cabeçalho Content-Type: application/json.
 */
app.use(express.json());
/**
 * Middleware que faz o parsing do corpo da requisição no formato URL-encoded
 * (como o enviado por formulários HTML).
 * O parâmetro `extended: true` permite o uso de objetos e arrays complexos
 * no corpo da requisição (não apenas pares chave-valor simples).
 * Esse parsing é feito utilizando a biblioteca `qs`, que suporta a complexidade.
 */
app.use(express.urlencoded({ extended: true }));
/**
 * Middleware que habilita o CORS (Cross-Origin Resource Sharing) para permitir ou
 * restringir o acesso à API a partir de diferentes origens (domínios).
 * O método `cors(corsOptions())` aplica configurações específicas de CORS,
 * permitindo controlar quais origens, métodos e cabeçalhos podem interagir com a API.
 */
app.use(cors(corsOptions()));

let currentJson: ITubeServerManagerApi;

app.get(`/api/${apiVersion}/videos/data`, (request, response: Response) => {
  fs.readFile(inMemoryDatabasePath, (error, data) => {
    if (error) {
      return response.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        error: "Erro ao tentar ler os dados do arquivo!", 
        timestamp: formatDate(),
      });
    } else {
      currentJson = JSON.parse(data.toString());
      return response.status(StatusCode.OK).json(currentJson);
    }
  });
});

app.post(`/api/${apiVersion}/videos/data`, (request: Request, response: Response): any => {
  if (Object.keys(request.body).length !== 0) {
    currentJson.videos.data.push(request.body);

    fs.writeFile(
      inMemoryDatabasePath,
      JSON.stringify(currentJson, null, 2),
      (error) => {
        if (error) {
          return response.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            error: sendStatusCodeMessage(StatusCode.INTERNAL_SERVER_ERROR),
          });
        }
        return response.status(StatusCode.CREATED).json({ api: currentJson });
      }
    );
  } else
    return response
      .status(StatusCode.BAD_REQUEST)
      .json({ error: sendStatusCodeMessage(StatusCode.BAD_REQUEST) });
});
