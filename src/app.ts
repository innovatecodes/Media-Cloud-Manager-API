import express from "express";
import cors from "cors";
import { apiVersion, corsOptions } from "./app/utils/utils";
import videoRoutes from "./app/routes/tube-server-manager.routes";

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

app.use(`/api/${apiVersion}/videos`, videoRoutes);

