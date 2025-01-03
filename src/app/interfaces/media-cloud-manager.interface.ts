import { ContentType, HttpMethod, StatusCode } from "../utils/enums";

export interface IMedia<T extends string | null> {
  media_id?: number;
  genres: string[];
  categories: string[];
  media_description: string;
  title: string;
  media_posted_at?: T;
  media_updated_at?: T;
  link: string;
  default_image_file: T;
  cloudinary_secure_url: T;
  temporary_public_id: T;
}

export interface IData {
  data: Array<IMedia<string>>;
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





