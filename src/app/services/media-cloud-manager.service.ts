import { Request, Response } from "express";
import { IData, IMedia } from "../interfaces/media-cloud-manager.interface";
import { ValidationError } from "../errors/validation.error";
import { NotFoundError } from "../errors/not-found.error";
import { formatDate } from "../utils/formate-date";
import { removeAccents } from "../utils/remove.accents";
import { EndPoint, HttpMethod, StatusCode } from "../utils/enums";
import { loadNodeEnvironment } from "../utils/dotenv.config";
import { parseUrlSearch } from "../utils/parse-url-search";
import { removeWhiteSpace } from "../utils/remove-white-space";
import { MediaCloudManagerRepository } from "../repositories/media-cloud-manager.repository";
import { paginateMediaContent } from "../utils/paginate-media-content";

loadNodeEnvironment();

export class MediaCloudManagerService {
  public static async getAllMediaContent(req: Request, res: Response) {
    try {
      const data = await MediaCloudManagerRepository.loadDataAfterReadFile() as IData;
      const paginatedData = paginateMediaContent(req, res, 1, 10, data);
      return paginatedData;
    } catch (error) {
      throw error;
    }
  }

  public static async search(req: Request = {} as Request, res: Response = {} as Response) {
    try {
      const data = await MediaCloudManagerRepository.loadDataAfterReadFile() as IData;
      const { search, initialKey } = parseUrlSearch(req);
      const reqByGenre = (req.query.genre as string)?.toLowerCase();
      const reqByCategory = (req.query.category as string)?.toLowerCase();
      const reqBySearch = (removeAccents(req.query.search as string))?.toLowerCase();
      const hasSearchParams = search.searchParams.has('category') || search.searchParams.has('genre') || search.searchParams.has('search');
      const apiUrl = `${process.env.URL}${EndPoint.MEDIA}`;
      const finalUrl = apiUrl.endsWith('?') ? apiUrl.split('?').at(0) : apiUrl;

      const filtered: IMedia<string>[] = data.data.filter(q => {
        if ('genre' in req.query && 'category' in req.query)
          return q.genres.some(c => c.toLowerCase().includes(removeWhiteSpace(reqByGenre)) && reqByGenre.length > 0) && q.categories.some(c => c.toLowerCase().includes(removeWhiteSpace(reqByCategory)) && reqByCategory.length > 0);

        if ('genre' in req.query)
          return q.genres.some(c => c.toLowerCase().includes(removeWhiteSpace(reqByGenre)) && reqByGenre.length > 0);

        if ('category' in req.query)
          return q.categories.some(c => c.toLowerCase().includes(removeWhiteSpace(reqByCategory)) && reqByCategory.length > 0);

        if ('search' in req.query) {
          const reqBySearchSanitized = removeWhiteSpace(reqBySearch);
          if (reqBySearchSanitized.length <= 0) return;
          else return (removeAccents(q.media_description.toLowerCase()).includes(reqBySearchSanitized)) || (removeAccents(q.title.toLowerCase()).includes(reqBySearchSanitized));
        }
        return false; // []
      });

      const hasQueryString = (...args: string[]): boolean => args.includes('genre') || args.includes('category') || args.includes('search');
      if (hasQueryString(...Object.keys(req.query))) {
        if (filtered.length === 0) {
      
          if ('genre' in (req.query) && ('category' in req.query))
            throw new ValidationError(`Infelizmente, não encontramos resultados para sua busca!`);

          if ('genre' in req.query && !('category' in req.query) && reqByGenre.length > 0)
            throw new ValidationError(`Nenhum resultado encontrado para o gênero \"${removeWhiteSpace(reqByGenre)}\"!`);
          else if ('genre' in req.query && !('category' in req.query) && reqByGenre.length === 0)
            return res.redirect(StatusCode.FOUND, `${finalUrl}`); 

          if ('category' in req.query && !('genre' in req.query) && reqByCategory.length > 0)
            throw new ValidationError(`Nenhum resultado encontrado para a categoria \"${removeWhiteSpace(reqByCategory)}\"!`);
          else if ('category' in req.query && !('genre' in req.query) && reqByCategory.length === 0)
            return res.redirect(StatusCode.FOUND, `${finalUrl}`); 

          if ('search' in (req.query) && reqBySearch.length > 0)
            throw new ValidationError(`Nenhum resultado encontrado para \"${removeWhiteSpace(reqBySearch)}\"!`);
          else return res.redirect(StatusCode.FOUND, `${finalUrl}`); // throw new ValidationError(`É necessário especificar o tipo de conteúdo para prosseguir com a busca!`);
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

  public static async getMediaContentById(id: number) {
    try {
      const data = (await MediaCloudManagerRepository.loadDataAfterReadFile() as IData);
      const itemFound = data.data.find((column => column.media_id === id));
      if (!itemFound) throw new NotFoundError("Item não encontrado!");
      return itemFound;
    } catch (error) {
      throw error;
    }
  }

  public static async createMediaContent(req: Request, res?: Response) {
    try {
      const data = (await MediaCloudManagerRepository.loadDataAfterReadFile()) as IData;

      this.validateRequest(req);

      if (!data?.data) data.data = [];

      const sortedData: IMedia<string> = {
        genres: (req.body.genres as string).toLowerCase().split(",").map(value => value.trim()),
        categories: (req.body.categories as string).toLowerCase().split(",").map(value => value.trim()),
        media_description: (req.body.media_description as string).trim(),
        title: (req.body.title as string).trim(),
        media_posted_at: formatDate(),
        media_updated_at: req.body.media_updated_at,
        link: (req.body.link as string).trim(),
        default_image_file: `${process.env.URL}/uploads/${req.file?.filename ?? 'no-image.jpg'}`,
        cloudinary_secure_url: (res?.locals as { secure_url: string })?.secure_url,
        temporary_public_id: (res?.locals as { public_id: string }).public_id?.replace('uploads/', ''),
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

  public static async updatePartialMediaContent(id: number, req: Request, res?: Response) {
    try {
      const { media_description, title, link } = req.body;
      const data = await MediaCloudManagerRepository.loadDataAfterReadFile() as IData;
      const index = data.data.findIndex((column) => column.media_id === id);

      if (index === -1) throw new NotFoundError("Item não encontrado!");

      data.data[index].media_description = (media_description as string)?.trim() ?? data.data[index].media_description
      data.data[index].title = (title as string)?.trim() ?? data.data[index].title;
      data.data[index].media_updated_at = formatDate();
      data.data[index].link = (link as string)?.trim() ?? data.data[index].link;
      data.data[index].default_image_file = !req.file?.filename ? data.data[index].default_image_file : `${process.env.URL}/uploads/${req.file?.filename}`;
      data.data[index].cloudinary_secure_url = (res?.locals as { secure_url: string }).secure_url ?? data.data[index].cloudinary_secure_url;
      data.data[index].temporary_public_id = (res?.locals as { public_id: string }).public_id?.replace('uploads/', '') ?? data.data[index].temporary_public_id;

      await MediaCloudManagerRepository.writeToFile("Erro ao tentar atualizar os dados!", data);
      return data.data[index];
    } catch (error) {
      throw error;
    }
  }

  public static async deleteMediaContent(id: number) {
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

  private static validateRequest(req: Request) {
    if (!HttpMethod.POST) return;
    if (!req.body.media_description) throw new ValidationError("O campo 'descrição' não pode ser vazio!");
    if (!req.body.title) throw new ValidationError("O campo 'título' não pode ser vazio!");
    if (!req.body.link) throw new ValidationError("O campo 'link' não pode ser vazio!");
  }
























































}


