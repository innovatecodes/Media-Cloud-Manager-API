
import { StatusCode } from "../utils/enums";
import { sendStatusCodeMessage } from "../utils/send-status-code";
import { BaseError } from "./base.error";

export class UnsupportedMediaTypeError extends BaseError {
    constructor(statusMessage?: string) {
        super(StatusCode.UNSUPPORTED_MEDIA_TYPE, statusMessage || sendStatusCodeMessage(StatusCode.UNSUPPORTED_MEDIA_TYPE))
    }
}
