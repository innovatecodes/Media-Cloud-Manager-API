import express from "express";
import { routes } from "./app/routes/media-cloud-manager.routes.js";
import path from "node:path";
import cors from 'cors';
import { ErrorMiddleware } from "./app/middlewares/error.middleware.js";
import { corsOptions } from "./app/utils/cors-options.js";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const app = express();

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename); 

app.use(express.json({ limit: '3mb' }));
app.use(express.urlencoded({ extended: true })); 
app.use(cors(corsOptions)); 
app.use('/uploads', express.static(path.join(__dirname, 'assets', 'uploads')));
app.use('/js', express.static(path.join(__dirname, '..', 'public', 'js')));

app.use(routes);

new ErrorMiddleware().setError(app);


