import { ContentType, HttpMethod, StatusCode } from "../utils/utils";

interface ApiDetails<T extends Date | null | string = string > extends ILicense {
  description: string;
  version: number;
  author: string;
  created_at: T;
  last_update?: T;
}

interface ILicense {
  type: string;
  url: string;
  terms: string;
}

interface IYouTubeVideoDetails<T extends Date | string = string> {
  id?: number;
  categories: Array<string>;
  description: string;
  title: string;
  posted_at: T;
  link: string;
  image_url?: string;
}

interface IData {
  data: IYouTubeVideoDetails[];
}

export interface ITubeServerManagerApi{
  api_details: ApiDetails;
  videos: IData;
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
