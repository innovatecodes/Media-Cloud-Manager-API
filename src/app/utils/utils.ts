// import 'dotenv/config';
import * as dotenv from "dotenv";
import { Request } from "express";
import {
  ICorsOptions,
  // ITubeServerManagerApi,
} from "../interfaces/tube-server-manager.interface";
import path = require("path");

type TProtocol = "http" | "https";

export const apiVersion: string = "v1";

export const loadNodeEnvironment = (): dotenv.DotenvConfigOutput =>
  dotenv.config({
    path: `${__dirname}/../../../${
      process.env.NODE_ENV === "development" ? ".env" : ".env.production"
    }`,
  });

export enum StatusCode {
  OK = 200, // Requisição bem-sucedida
  CREATED = 201, // Recurso criado com sucesso
  ACCEPTED = 202, // Requisição aceita, mas ainda não processada
  NO_CONTENT = 204, // Requisição bem-sucedida, mas sem conteúdo no corpo da resposta
  MOVED_PERMANENTLY = 301, // Recurso movido permanentemente para outro URI
  FOUND = 302, // Recurso encontrado temporariamente em outro URI
  SEE_OTHER = 303, // Redirecionar para outro recurso com GET
  NOT_MODIFIED = 304, // Recurso não modificado desde a última requisição
  TEMPORARY_REDIRECT = 307, // Redirecionamento temporário para outro URI
  PERMANENT_REDIRECT = 308, // Redirecionamento permanente para outro URI
  BAD_REQUEST = 400, // Requisição inválida ou malformada
  UNAUTHORIZED = 401, // Falta de autenticação ou credenciais inválidas
  PAYMENT_REQUIRED = 402, // Reservado para uso futuro
  FORBIDDEN = 403, // Acesso ao recurso negado
  NOT_FOUND = 404, // Recurso não encontrado
  METHOD_NOT_ALLOWED = 405, // Método HTTP não permitido para o recurso
  NOT_ACCEPTABLE = 406, // O servidor não pode gerar um conteúdo aceitável
  CONFLICT = 409, // Conflito com o estado atual do recurso
  GONE = 410, // Recurso não está mais disponível
  UNSUPPORTED_MEDIA_TYPE = 415, // Tipo de mídia na requisição não suportado
  TOO_MANY_REQUESTS = 429, // Número de requisições excedeu o limite
  INTERNAL_SERVER_ERROR = 500, // Erro interno no servidor
  NOT_IMPLEMENTED = 501, // Funcionalidade solicitada não implementada no servidor
  BAD_GATEWAY = 502, // O servidor recebeu uma resposta inválida ao acessar outro servidor
  SERVICE_UNAVAILABLE = 503, // O servidor está temporariamente indisponível
  GATEWAY_TIMEOUT = 504, // O servidor não recebeu uma resposta a tempo ao acessar outro servidor
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export enum EndPoint {
  VIDEOS = "videos/data",
  GET_VIDEO_BY_ID = "videos/data/:id",
}

export enum ContentType {
  JSON = "application/json",
  PLAIN = "text/plain",
  HTML = "text/html",
  XML = "application/xml",
}

export const sendStatusCodeMessage = (status: StatusCode): string => {
  let statusMessage: string = "";

  switch (status) {
    case StatusCode.OK:
      statusMessage =
        "A solicitação foi bem-sucedida e a resposta contém os dados solicitados.";
      break;
    case StatusCode.CREATED:
      statusMessage =
        "A solicitação foi bem-sucedida e resultou na criação de um novo recurso.";
      break;
    case StatusCode.NO_CONTENT:
      statusMessage =
        "A solicitação foi bem-sucedida, mas não há conteúdo para retornar.";
      break;
    case StatusCode.BAD_REQUEST:
      statusMessage =
        "O servidor não conseguiu entender a solicitação devido a erros de sintaxe.";
      break;
    case StatusCode.UNAUTHORIZED:
      statusMessage = "Credenciais inválidas, a autenticação falhou.";
      break;
    case StatusCode.FORBIDDEN:
      statusMessage =
        "O servidor entendeu a solicitação, mas recusa a autorizar o acesso ao recurso.";
      break;
    case StatusCode.NOT_FOUND:
      statusMessage =
        "O servidor não conseguiu encontrar o recurso solicitado.";
      break;
    case StatusCode.METHOD_NOT_ALLOWED:
      statusMessage =
        "O método HTTP usado não é permitido para o recurso solicitado.";
      break;
    case StatusCode.INTERNAL_SERVER_ERROR:
      statusMessage =
        "O servidor encontrou uma condição inesperada que o impediu de completar a solicitação.";
      break;
  }

  return statusMessage;
};

export const corsOptions = (): ICorsOptions<
  Record<string, ContentType> | Record<string, string>
> => {
  return {
    // origin: "*",
    origin: "http://localhost:4200",
    methods: [
      HttpMethod.GET,
      HttpMethod.PUT,
      HttpMethod.PATCH,
      HttpMethod.POST,
      HttpMethod.DELETE,
    ],
    allowHeaders: { "Content-Type": ContentType.JSON },
    preflightContinue: false,
    optionsSuccessStatus: StatusCode.NO_CONTENT,
  };
};

export const formatDate = (): string => {
  // Função para formatar a data no formato 'YYYY-MM-DD HH:mm:ss'
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const inMemoryDatabasePath = path.join(
  __dirname,
  "../repositories",
  "videos.json"

  /*
      __dirname,
      "..",
      "..",
      "..",
      "videos.json"
  */
);

export const generateHash = (quantity: number): string => {
  let key: string = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#&*()-_=+[]{}|.<>/\\";

  for (let index = 0; index < quantity; index++)
    key += characters[Math.floor(Math.random() * characters.length)];

  return key;
};

export const httpProtocol = (request: Request): TProtocol => {
  const httpProtocol = request.socket.localPort !== 443 ? "http" : "https";
  return httpProtocol;
};
