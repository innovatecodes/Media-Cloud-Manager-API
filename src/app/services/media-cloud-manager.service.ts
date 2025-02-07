import { Request, Response } from "express";
import { IData, IMedia } from "../interfaces/media-cloud-manager.interface.js";
import { ValidationError } from "../errors/validation.error.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { formatDate } from "../utils/formate-date.js";
import { removeAccents } from "../utils/remove.accents.js";
import { EndPoint, HttpMethod, StatusCode } from "../utils/enums.js";
import { loadNodeEnvironment } from "../utils/dotenv.config.js";
import { parseUrlSearch } from "../utils/parse-url-search.js";
import { removeWhiteSpace } from "../utils/remove-white-space.js";
import { MediaCloudManagerRepository } from "../repositories/media-cloud-manager.repository.js";
import { paginate } from "../utils/paginate.js";
import { UrlWithStringQuery } from 'url';

loadNodeEnvironment();

export class MediaCloudManagerService {
  public static async getAll(req: Request, res: Response) {
    try {
      const data = await MediaCloudManagerRepository.loadDataAfterReadFile() as IData;
      return paginate(req, res, 1, 10, data);
    } catch (error) {
      throw error;
    }
  }

  public static async search(req: Request = {} as Request, res: Response = {} as Response) {
    try {

      const data = await MediaCloudManagerRepository.loadDataAfterReadFile() as IData;
      const { search } = parseUrlSearch(req);
      const reqCategory = removeAccents((search.searchParams.get('category') as string)?.toLowerCase());
      const reqSearch = (removeAccents(search.searchParams.get('search') as string)?.toLowerCase());
      const hasSearchParams = search.searchParams.has('category') || search.searchParams.has('search');
      const apiUrl = `${process.env.URL}${EndPoint.MEDIA}`;
      const finalUrl = apiUrl.endsWith('?') ? apiUrl.split('?').at(0) : apiUrl;


      const filtered: IMedia[] = data.data.filter(q => {

        if ('category' in req.query)
          return q.category_list?.some(c => removeAccents(c.toLowerCase())?.includes(removeWhiteSpace(reqCategory)) && reqCategory?.length > 0);

        if ('search' in req.query) {
          const reqSearchSanitized = removeWhiteSpace(reqSearch);
          if (reqSearchSanitized.length <= 0) return;
          else return (removeAccents(q.media_description?.toLowerCase()).includes(reqSearchSanitized)) || (removeAccents(q.title?.toLowerCase()).includes(reqSearchSanitized));
        }
        return false;
      });

      const hasQueryString = (...args: string[]): boolean => args.includes('category') || args.includes('search');
      if (hasQueryString(...Object.keys(req.query))) {
        if (filtered.length === 0) {
          if ('category' in (req.query) && reqCategory.length > 0)
            throw new ValidationError(`Nenhum resultado encontrado para a categoria \"${removeWhiteSpace(reqCategory)}\"!`);
          else if ('category' in req.query && reqCategory.length === 0)
            return res.redirect(StatusCode.FOUND, `${finalUrl}`);

          if ('search' in (req.query) && reqSearch.length > 0)
            throw new ValidationError(`Nenhum resultado encontrado para \"${removeWhiteSpace(reqSearch)}\"!`);
          else return res.redirect(StatusCode.FOUND, `${finalUrl}`);
        }

      }
      else if ((search.href.includes('?') && !hasSearchParams)) {
        return res.redirect(StatusCode.FOUND, `${finalUrl}`)
      };

      return filtered && filtered.length > 1 ? filtered : filtered[0];
    } catch (error) {
      throw error;
    }
  }

  public static async getById(id: number) {
    try {
      const data = (await MediaCloudManagerRepository.loadDataAfterReadFile() as IData);
      const itemFound = data.data.find((column => column.media_id === id));
      if (!itemFound) throw new NotFoundError("Item não encontrado!");
      return itemFound;
    } catch (error) {
      throw error;
    }
  }

  public static async save(req: Request, res: Response = {} as Response) {
    try {
      const { category_list, media_description, title, link } = req.body;

      const data = (await MediaCloudManagerRepository.loadDataAfterReadFile()) as IData;

      this.validateFields(req);

      if (!data?.data) data.data = [];

      const sortedData: IMedia = {
        category_list: (category_list as string[]).map((value: string) => removeWhiteSpace(value.toLowerCase().trim())),
        media_description: (media_description as string).trim(),
        title: (title as string).trim(),
        posted_at: new Date().toLocaleString(), // formatDate(),
        updated_at: "",
        link: (link as string).trim(),
        default_image_file: `${process.env.URL}/uploads/no-image.jpg`,
        cloudinary_secure_url: (res?.locals as { secure_url: string })?.secure_url ?? "",
        temporary_public_id: (res.locals as { public_id: string }).public_id?.replace('uploads/', '') ?? "",
        original_filename: (res.locals as { inserted: string }).inserted ?? "",
      }

      data.data.push({
        media_id: data.data.at(-1)?.media_id
          ? Number(data.data.at(-1)?.media_id) + 1
          : 1,
        ...sortedData,
      });

      return await MediaCloudManagerRepository.writeToFile("Erro ao tentar salvar os dados!", data);
    } catch (error) {
      throw error;
    }
  }

  public static async update(id: number, req: Request = {} as Request, res: Response = {} as Response) {
    try {
      const { media_description, title, link } = req.body;
      const data = await MediaCloudManagerRepository.loadDataAfterReadFile() as IData;
      const index = data.data.findIndex((column) => column.media_id === id);

      if (index === -1) throw new NotFoundError("Item não encontrado!");

      data.data[index].media_description = (media_description as string)?.trim() ?? data.data[index].media_description;
      data.data[index].title = (title as string)?.trim() ?? data.data[index].title;
      data.data[index].updated_at = new Date().toLocaleString(); //formatDate();
      data.data[index].link = (link as string)?.trim() ?? data.data[index].link;
      data.data[index].cloudinary_secure_url = (res.locals as { secure_url: string }).secure_url;
      data.data[index].temporary_public_id = (res.locals as { public_id: string }).public_id?.replace('uploads/', '');
      data.data[index].original_filename = (res.locals as { inserted: string }).inserted;

      await MediaCloudManagerRepository.writeToFile("Erro ao tentar atualizar os dados!", data);
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  public static async delete(id: number) {
    try {
      const data = await MediaCloudManagerRepository.loadDataAfterReadFile() as IData;
      const index = data.data.findIndex((column) => column.media_id === id);

      if (index === -1) throw new NotFoundError("Item não encontrado!");

      data.data.splice(index, 1);

      await MediaCloudManagerRepository.deleteFromFile(id);
      return await MediaCloudManagerRepository.writeToFile("Erro ao tentar excluir o item!", data);
    } catch (error) {
      throw error;
    }
  }

  private static validateFields(req: Request) {
    const { media_description, title, link } = req.body;
    if ([HttpMethod.GET, HttpMethod.PUT, /*HttpMethod.PATCH*/, HttpMethod.DELETE]?.includes(req.method as HttpMethod)) return;
    if (!media_description) throw new ValidationError("O campo 'descrição' não pode ser vazio!");
    if (!title) throw new ValidationError("O campo 'título' não pode ser vazio!");
    if (!link) throw new ValidationError("O campo 'link' não pode ser vazio!");
  }
























































}


function pagination(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, arg2: number, arg3: number, data: IData) {
  throw new Error("Function not implemented.");
}

