import { StatusCode } from "../utils/enums";
import { sendStatusCodeMessage } from "../utils/send-status-code";
import { BaseError } from "./base.error";

export class ContentTooLargeError extends BaseError {
    constructor(statusMessage?: string) {
        super(StatusCode.CONTENT_TOO_LARGE, statusMessage || sendStatusCodeMessage(StatusCode.CONTENT_TOO_LARGE));
    }
}