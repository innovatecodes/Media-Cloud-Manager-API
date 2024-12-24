import { StatusCode } from "../utils/enums";
import { sendStatusCodeMessage } from "../utils/send-status-code";
import { BaseError } from "./base.error";

export class InternalServerError extends BaseError {
    constructor(statusMessage?: string) {
        super(StatusCode.INTERNAL_SERVER_ERROR, statusMessage || sendStatusCodeMessage(StatusCode.INTERNAL_SERVER_ERROR));
    }
}