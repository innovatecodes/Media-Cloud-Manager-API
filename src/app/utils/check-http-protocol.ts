import { Request } from 'express';

export const httpProtocol = (request: Request): "http" | "https" => {
    const httpProtocol = request.socket.localPort !== 443 ? "http" : "https";
    return httpProtocol;
  };