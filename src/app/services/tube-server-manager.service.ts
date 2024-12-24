import { Request, Response } from "express";
import { IData, IYouTubeVideo } from "../interfaces/tube-server-manager.interface";
import { TubeServerManagerRepository } from "../repositories/tube-server-manager.repository";
import { ValidationError } from "../errors/validation.error";
import { NotFoundError } from "../errors/not-found.error";
import { truncateText } from "../utils/truncate-text";
import { formatDate } from "../utils/formate-date";
import { removeAccents } from "../utils/remove.accents";
import { EndPoint, StatusCode } from "../utils/enums";
import { loadNodeEnvironment } from "../utils/dotenv.config";
import { parseUrlSearch } from "../utils/parse-url-search";
import { clearString } from "../utils/clear-string";

loadNodeEnvironment()
export class TubeServerManagerService {
  public static async getAll(req: Request = {} as Request, res: Response = {} as Response) {
    const data = await TubeServerManagerRepository.loadDataAfterReadFile() as IData;
    data.data.map(column => column.media_description = truncateText(column.media_description, 250));

    const { search, initialKey } = parseUrlSearch(req);
    const filteredCategory = (req.query.category as string)?.toLowerCase();
    const filteredTerms = (removeAccents(req.query.terms as string))?.toLowerCase();
    const hasQueryString = (search.search.includes("category") ? 'category' : search.search.includes("terms") ? 'terms' : ""); // (Object.keys((req.query)).includes("category") ? 'category' : Object.keys(req.query).includes("terms") ? 'terms' : undefined);

    const filtered = data.data.filter(q => {
      if (hasQueryString === 'category')
        return Array.isArray(q.categories) && q.categories.some(c => c.toLowerCase().includes(filteredCategory.toLowerCase()) && filteredCategory.length > 1);
      if (hasQueryString === 'terms')
        return (removeAccents(q.media_description.toLowerCase()).indexOf(filteredTerms) !== -1) || (removeAccents(q.title.toLowerCase()).indexOf(filteredTerms) !== -1) && filteredTerms.length > 1;
      return false;
    });

    switch (hasQueryString) {
      case 'category':
        if (filteredCategory === '')
          throw new ValidationError('Forneça uma categoria!');
        if (filtered.length === 0)
          throw new ValidationError(`${filtered.length} resultado para \"${clearString(filteredCategory)}\", categoria não encontrada!`);
        break;
      case 'terms':
        if (filteredTerms === '')
          throw new ValidationError('Por favor, forneça um termo para busca!');
        if (filtered.length === 0)
          throw new ValidationError(`${filtered.length} resultado para \"${clearString(filteredTerms)}\"!`);
        break;
      default:
        if ((search.href.includes('?') && initialKey === undefined) || (search.search.includes('?') && initialKey !== 'category' && initialKey !== 'terms')) {
          const apiUrl = `${process.env.URL}${EndPoint.API}v1${EndPoint.MEDIA}`
          const finalUrl = apiUrl.endsWith('?') ? apiUrl.split('?').at(0) : apiUrl;
          return res.redirect(StatusCode.FOUND, `${finalUrl}`);
          // throw new ValidationError(`O parãmeto ${clearString(initialKey as string) /** Object.keys(req.query).shift() */} não é válido!`);
        }
        break;
    }

    await TubeServerManagerRepository.writeToFile(
      "Erro ao tentar buscar pela categoria!",
      data
    );

    return hasQueryString ? filtered.length > 1 ? filtered : filtered[0] : data.data;
  }

  public static async getMediaContentById(id: number) {
    const data = (await TubeServerManagerRepository.loadDataAfterReadFile() as IData);
    const itemFound = data.data.find((column => column.content_id === id));
    if (!itemFound) throw new NotFoundError("Item não encontrado!");
    return itemFound;
  }

  public static async createMediaContent(req: Request, res?: Response) {
    const data = (await TubeServerManagerRepository.loadDataAfterReadFile()) as IData;

    this.validateRequest(req);

    if (!data?.data) data.data = [];

    const sortedData: IYouTubeVideo<string> = {
      media_type: req.body.media_type,
      categories: (req.body.categories as string).toLowerCase().split(","),
      media_description: truncateText(req.body.media_description, 140),
      title: req.body.title,
      posted_at: formatDate(),
      updated_at: req.body.updated_at,
      link: req.body.link,
      default_image_file: `${process.env.URL}/uploads/${req.file?.filename ?? 'no-image.jpg'}`,
      cloudinary_secure_url: (res?.locals as { secure_url: string }).secure_url,
      temporary_public_id: (res?.locals as { public_id: string }).public_id.replace('uploads/', ''),
      likes: req.body.likes,
    }

    data.data.push({
      content_id: data.data.at(-1)?.content_id
        ? Number(data.data.at(-1)?.content_id) + 1
        : 1,
      ...sortedData,
    });

    await TubeServerManagerRepository.writeToFile(
      "Erro ao tentar salvar os dados!",
      data
    );

    return data;
  }

  public static async updateMediaContent(id: number, req: Request, res?: Response) {
    const { media_type, categories, media_description, title, link, likes } = req.body;
    const data = await TubeServerManagerRepository.loadDataAfterReadFile() as IData;
    const index = data.data.findIndex((column) => column.content_id === id);

    if (index === -1) throw new NotFoundError("Item não encontrado!");

    this.validateRequest(req);

    data.data[index].media_type = media_type;
    data.data[index].categories = categories;
    data.data[index].media_description = media_description;
    data.data[index].title = title;
    data.data[index].updated_at = formatDate();
    data.data[index].link = link;
    data.data[index].default_image_file = `${process.env.URL}/uploads/${req.file?.filename ?? 'no-image.jpg'}`;
    data.data[index].cloudinary_secure_url = (res?.locals as { secure_url: string }).secure_url;
    data.data[index].temporary_public_id = (res?.locals as { public_id: string }).public_id.replace('uploads/', '');
    data.data[index].likes = likes;

    await TubeServerManagerRepository.writeToFile(
      "Erro ao tentar atualizar os dados!",
      data
    );
    return data;
  }

  public static async updateImageFile(id: number, req: Request, res?: Response) {
    const data = await TubeServerManagerRepository.loadDataAfterReadFile() as IData;
    const index = data.data.findIndex((index) => index.content_id === id);

    if (index === -1) throw new NotFoundError("Item não encontrado!");

    if (req.file?.filename) {
      data.data[index].updated_at = formatDate();
      data.data[index].default_image_file = `${process.env.URL}/uploads/${req.file?.filename ?? 'no-image.jpg'}`;
      data.data[index].cloudinary_secure_url = (res?.locals as { secure_url: string }).secure_url;
      data.data[index].temporary_public_id = (res?.locals as { public_id: string }).public_id.replace('uploads/', '');
    }

    await TubeServerManagerRepository.writeToFile(
      "Erro ao tentar atualizar a imagem!",
      data
    );
    return data.data[index];
  }

  public static async deleteMediaContent(id: number) {
    const data = await TubeServerManagerRepository.loadDataAfterReadFile() as IData;
    const index = data.data.findIndex((column) => column.content_id === id);

    if (index === -1) throw new NotFoundError("Item não encontrado!");

    data.data.splice(index, 1);
    await TubeServerManagerRepository.writeToFile(
      "Erro ao tentar excluir o item!",
      data
    );
    return data;
  }

  private static validateRequest(req: Request) {
    if (!req.body.media_type) throw new ValidationError("O campo 'tipo de mídia' não pode ser vazio!");
    if (!req.body.categories) throw new ValidationError("O campo 'categoria' não pode ser vazio!");
    if (!req.body.media_description) throw new ValidationError("O campo 'descrição' não pode ser vazio!");
    if (!req.body.title) throw new ValidationError("O campo 'título' não pode ser vazio!");
    if (!req.body.link) throw new ValidationError("O campo 'link' não pode ser vazio!");
  }

}


