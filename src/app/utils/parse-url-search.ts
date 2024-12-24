import { Request } from "express";

export const parseUrlSearch = (req: Request) => {
    const parsedUrl = new URL(req?.url, `${req.protocol}://${req.hostname as string}`);
    const initialQueryKey = (parsedUrl.searchParams).keys().next().value;

    return { search: parsedUrl, initialKey: initialQueryKey };
};


