
import { StatusCode } from "../utils/enums.js";
import { sendStatusCodeMessage } from "../utils/send-status-code.js";
import { BaseError } from "./base.error.js";

export class NotFoundError extends BaseError {
    constructor(statusMessage?: string) {
        super(StatusCode.NOT_FOUND, statusMessage || sendStatusCodeMessage(StatusCode.NOT_FOUND))
    }
}


