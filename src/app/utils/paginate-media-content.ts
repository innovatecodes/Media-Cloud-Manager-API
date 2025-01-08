import { Request, Response } from "express";
import { IData, IMedia, IPaginationDetails, IPaginationResponse } from "../interfaces/media-cloud-manager.interface";
import { EndPoint, StatusCode } from "./enums";
import { parseUrlSearch } from "./parse-url-search";

export const paginateMediaContent = (req: Request, res: Response, page: number = 1, limit: number = 5, data?: IData, sortBy?: string, sortOrder: string = 'ASC') => {
    const { search } = parseUrlSearch(req);
    const apiUrl = `${process.env.URL}${EndPoint.MEDIA}`;
    const finalUrl = apiUrl.endsWith('?') ? apiUrl.split('?').at(0) : apiUrl;

    let $page = Math.max(1, Number(req.query.page) || page);
    const totalItems = data?.data.length ?? 0;
    const limitPerPage = limit;
    const numberOfPages = Math.ceil(totalItems / limitPerPage);
    const offset = ($page - 1) * limitPerPage;

    // Se a página solicitada for maior que o número total de páginas, redireciona
    if ($page > numberOfPages) {
        $page = numberOfPages;
        return res.redirect(StatusCode.FOUND, `${process.env.URL}${EndPoint.MEDIA}?page=${$page}`);
    }
    // Se o parâmetro 'page' estiver na URL mas for menor que 1, redireciona
    if (search.searchParams.has('page') && Number(search.searchParams.get('page')) < 1)
        return res.redirect(StatusCode.FOUND, `${process.env.URL}${EndPoint.MEDIA}?page=${$page}`);
    // Se o parâmetro 'page' não estiver presente, redireciona para a URL base
    if (search.href.includes('?') && !search.searchParams.has('page'))
        return res.redirect(StatusCode.FOUND, `${finalUrl}`);

    const paginationResults: IMedia<string>[] = data?.data.slice(offset, offset + limitPerPage).sort(compareFn) ?? [];

    const paginationDetails: IPaginationDetails = {
        page: $page,
        totalItems: totalItems,
        limitPerPage: limitPerPage,
        numberOfPages: numberOfPages,
        offset: offset,
    }

    const paginatedData: IPaginationResponse<IMedia<string>[]> = {
        paginationDetails: paginationDetails,
        paginationResults: paginationResults,
    };

    Object.defineProperties(paginatedData, {
        paginationResults: { value: paginationResults },
        paginationDetails: { value: paginationDetails },
    });

    return 'page' in req.query ? paginatedData : data;

    function compareFn(a: IMedia<string>, b: IMedia<string>) {
        // Ordenação por título
        if (sortBy === 'title') {
            // Se 'a' não tiver data e 'b' tiver, coloca 'a' depois de 'b'.
            if (!a.media_posted_at && b.media_posted_at)
                return 1;
            // Se 'b' não tiver data e 'a' tiver, coloca 'b' antes de 'a'.
            if (a.media_posted_at && !b.media_posted_at)
                return -1;
            // Se ambos tiverem título, realiza a comparação por título (crescente ou decrescente).
            if (a.title && b.title)
                return sortOrder === 'DESC' 
                    ? b.title.localeCompare(a.title)  // Ordenação decrescente
                    : a.title.localeCompare(b.title); // Ordenação crescente
        }
        // Ordenação por data de postagem
        if (sortBy === 'media_posted_at') {
            // Se ambos tiverem data, realiza a comparação usando '>' (decrescente) ou 'localeCompare' (crescente).
            if (a.media_posted_at && b.media_posted_at) 
                return sortOrder === 'DESC' 
                    ? b.media_posted_at > a.media_posted_at ? 1 : -1  // Comparação decrescente (ISO 8601)
                    : a.media_posted_at.localeCompare(b.media_posted_at); // Comparação crescente (ISO 8601)
            if (!a.media_posted_at) return 1;     // Se 'a' não tiver data, coloca 'a' depois de 'b'.
            if (!b.media_posted_at) return -1; // Se 'b' não tiver data, coloca 'b' antes de 'a'.
        }
        return 0; // Se não houver critério de ordenação aplicável, mantém a ordem original.
    }    
};

