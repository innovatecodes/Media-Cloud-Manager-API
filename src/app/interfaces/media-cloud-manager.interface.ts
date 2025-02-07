import { ContentType, HttpMethod, StatusCode } from "../utils/enums.js";

export interface IMedia {
  media_id?: number;
  category_list?: string[];
  media_description: string;
  title: string;
  posted_at?: string;
  updated_at?: string;
  link: string;
  default_image_file?: string;
  cloudinary_secure_url?: string;
  temporary_public_id?: string;
  original_filename?: string;
}

export interface IData {
  data: Array<IMedia>;
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

export interface IPaginationDetails {
  page?: number,
  totalItems: number;
  limitPerPage: number;
  numberOfPages: number;
  offset: number;
}

export interface IPaginationResponse<T> {
  paginationDetails: IPaginationDetails;
  data: T;
}





