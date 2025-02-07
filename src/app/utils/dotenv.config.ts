// import 'dotenv/config';
import * as dotenv from "dotenv";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url); // Resolve o caminho completo do arquivo atual
const __dirname = dirname(__filename); // Resolve o diretório onde o arquivo está localizado

export const loadNodeEnvironment = (): dotenv.DotenvConfigOutput =>
  dotenv.config({
    path: `${__dirname}/../../../${process.env.NODE_ENV === "development" ? ".env" : ".env.prod"}`
  });

