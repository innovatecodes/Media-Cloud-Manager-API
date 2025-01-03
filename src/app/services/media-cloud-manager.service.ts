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
loadNodeEnvironment();

export class MediaCloudManagerService {
  public static async getAllMediaContent(req: Request = {} as Request, res: Response = {} as Response) {
    try {
      const data = await MediaCloudManagerRepository.loadDataAfterReadFile() as IData;
      const { search, initialKey } = parseUrlSearch(req);
      const filteredCategory = (req.query.category as string)?.toLowerCase();
      const filteredTerms = (removeAccents(req.query.terms as string)).toLowerCase();
      const filteredGenre = (req.query.genre as string)?.toLowerCase();
      const hasQueryParams = (search.search.includes("genre") ? 'genre' : search.search.includes("category") ? 'category' : search.search.includes("terms") ? 'terms' : ""); // (Object.keys((req.query)).includes("category") ? 'category' : Object.keys(req.query).includes("terms") ? 'terms' : undefined);
      const searchParamExists = search.searchParams.has('category') || search.searchParams.has('genre') || search.searchParams.has('terms');
      const searchParamValue = search.searchParams.get((initialKey.next().value as string)) ?? "";
      const searchMatches = (!data.data.some(q => q.media_description.indexOf(filteredTerms) !== -1) || !data.data.some(q => q.title.indexOf(filteredTerms) !== -1));
      const apiUrl = `${process.env.URL}${EndPoint.API}${EndPoint.MEDIA}`
      const finalUrl = apiUrl.endsWith('?') ? apiUrl.split('?').at(0) : apiUrl;

      const filtered = data.data.filter(q => {
        if (hasQueryParams.toLowerCase() === 'genre')
          return Array.isArray(q.genres) && q.genres.some(c => c.toLowerCase().includes(removeWhiteSpace(filteredGenre)) && filteredGenre.length > 1);
        if (hasQueryParams.toLowerCase() === 'category')
          return Array.isArray(q.genres) && q.categories.some(c => c.toLowerCase().includes(removeWhiteSpace(filteredCategory)) && filteredCategory.length > 1);
        if (hasQueryParams.toLowerCase() === 'terms')
          return (removeAccents(q.media_description.toLowerCase()).indexOf(removeWhiteSpace(filteredTerms)) !== -1) || (removeAccents(q.title.toLowerCase()).indexOf(removeWhiteSpace(filteredTerms)) !== -1) && filteredTerms.length > 1;
        return false; // []
      });

      switch (hasQueryParams) {
        case 'genre':
        case 'category':
        case 'terms':

          if (filtered.length === 0) {
            if (!data.data.some(q => q.genres.indexOf(filteredGenre) !== -1) || !data.data.some(q => q.genres.indexOf(filteredGenre) !== -1) || searchMatches)
              if (searchParamValue)
                throw new ValidationError(`${filtered.length} resultado para \"${removeWhiteSpace(searchParamValue)}\"!`);
              else
                return res.redirect(StatusCode.FOUND, `${finalUrl}`);
          }
          break;
        default:
          if ((search.href.includes('?') && !searchParamExists))
            return res.redirect(StatusCode.FOUND, `${finalUrl}`); // throw new ValidationError(`O parãmeto ${clearString(initialKey.next().value as string) /** Object.keys(req.query).shift() */} não é válido!`);
          break;
      }

      return hasQueryParams ? filtered.length > 1 ? filtered : filtered[0] : await MediaCloudManagerRepository.writeToFile(
        `Busca não encontrada!`,
        data
      );
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

      return await MediaCloudManagerRepository.writeToFile("Erro ao tentar atualizar os dados!", data);
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


