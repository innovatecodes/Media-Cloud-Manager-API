import { ContentType, HttpMethod, StatusCode } from "../utils/enums";

interface License {
  type: string;
  url: string;
  terms: string;
}

export interface Info<T extends string | null> {
  description: string;
  version: number;
  author: string;
  created_at: T;
  last_update: T;
  license: License;
}

export interface IYouTubeVideo<T extends string | null> {
  content_id?: number;
  media_type: string;
  categories: string[];
  media_description: string;
  title: string;
  posted_at: T;
  updated_at: T;
  link: string;
  default_image_file: T;
  cloudinary_secure_url: T;
  temporary_public_id: T;
  likes?: number;
}

export interface IData {
  data: Array<IYouTubeVideo<string>>;
}

export interface ICorsOptions<T extends string | boolean = boolean> {
  origin: T;
  methods: HttpMethod[];
  allowedHeaders: string[];
  preflightContinue: boolean;
  optionsSuccessStatus: StatusCode;
}

export interface ICustomHeader<T extends Record<string, ContentType> | Record<string, string>> {
  setHeader: T;
}

export interface IConnectionConfigSqlServer {
  user: string;  // Nome do usuário para autenticação
  password?: string;  // Senha para autenticação
  database: string;  // Nome do banco de dados
  server: string;  // Endereço do servidor (obrigatório)
  pool: IPool;  // Configurações de pool de conexões
  options?: IOptions;  // Opções adicionais de configuração (opcional)
}

interface IPool {
  max: number;  // Número máximo de conexões no pool
  min: number;  // Número mínimo de conexões no pool
  idleTimeoutMillis: number;  // Tempo limite para conexões inativas (em milissegundos)
}

interface IOptions {
  encrypt: boolean;  // Define se a conexão deve ser criptografada
  trustServerCertificate: boolean;  // Permite confiar em certificados de servidor não validados
}

