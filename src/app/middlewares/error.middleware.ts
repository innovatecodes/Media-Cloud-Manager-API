
import express, { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/validation.error.js";
import { InternalServerError } from "../errors/internal-server.error.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { ContentTooLargeError } from "../errors/content-too-large.error.js";
import { UnsupportedMediaTypeError } from "../errors/unsupported-media-type.error.js";
import { StatusCode } from "../utils/enums.js";
import { sendStatusCodeMessage } from "../utils/send-status-code.js";

export class ErrorMiddleware {
    setError(app: express.Express) {
        app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
            switch (true) {
                case error instanceof ValidationError:
                case error instanceof NotFoundError:
                case error instanceof InternalServerError:
                case error instanceof ContentTooLargeError:
                case error instanceof UnsupportedMediaTypeError:
                    error.dispatchError(res)
                    break;
                default:
                    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: error.message || sendStatusCodeMessage(StatusCode.INTERNAL_SERVER_ERROR) })
                    break;
            }
        });
    }
}

