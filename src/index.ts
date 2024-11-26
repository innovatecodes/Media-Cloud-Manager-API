import "dotenv/config";
import * as http from "http";
import { IHeaders, IApiDescription } from "./app/interfaces/configs.interface";

const headers: IHeaders = {
  "accept-charset": "utf-8",
  "content-type": "application/json",
};

const apiDescription: IApiDescription = {
  api_version: "v1",
  created_at: new Date("November 26, 2024 11:01:30 GMT-3:00").toLocaleString("pt-BR", /**{ timeZone: 'America/Sao_Paulo' }*/),
  web_developer: "Ronaldo Lopes",
  email: "contato@innovatecodes.com",
};

http
  .createServer(
    (request: http.IncomingMessage, response: http.ServerResponse) => {
      response.writeHead(200, "Ok", { ...headers });
      response.end(JSON.stringify(apiDescription));
    }
  )
  .listen(process.env.PORT || process.env.LOCAL_PORT, () => {
    console.log(
      `Server running on port ${process.env.PORT || process.env.LOCAL_PORT}`
    );
});
