import { ContentType, HttpMethod, StatusCode } from "../utils/utils";

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

interface IYouTubeVideo<T extends string | null> {
  video_id?: number;
  categories: Array<string>;
  video_description: string;
  title: string;
  posted_at: T;
  updated_at: T;
  link: string;
  image_url?: string;
  likes?: number;
}

export interface IData {
  data: IYouTubeVideo<string>[];
}

export interface ICorsOptions<
  T extends Record<string, ContentType> | Record<string, string>
> {
  origin: string;
  methods: Array<HttpMethod>;
  allowHeaders: T;
  preflightContinue: boolean;
  optionsSuccessStatus: StatusCode;
}
