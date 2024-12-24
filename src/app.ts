import express from "express";
import { routes } from "./app/routes/tube-server-manager.routes";
import path from "path";
import cors from 'cors';
import { ErrorMiddleware } from "./app/middlewares/error.middleware";
import { corsOptions } from "./app/utils/cors-options";

export const app = express();

app.use(express.json());

// Utiliza o middleware express.urlencoded() para fazer o parsing de requisições com corpo URL-encoded
// O parâmetro `extended: true` permite que o corpo da requisição seja interpretado com suporte a objetos e arrays complexos.
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, 'assets', 'uploads')));
app.use('/js', express.static(path.join(__dirname, '..', 'public', 'js')));

app.use(routes);

// Middleware de erros personalizados
new ErrorMiddleware().setError(app);

