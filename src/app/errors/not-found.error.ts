
import { StatusCode } from "../utils/enums";
import { sendStatusCodeMessage } from "../utils/send-status-code";
import { BaseError } from "./base.error";

export class NotFoundError extends BaseError {
    constructor(statusMessage?: string) {
        super(StatusCode.NOT_FOUND, statusMessage || sendStatusCodeMessage(StatusCode.NOT_FOUND))
    }
}


