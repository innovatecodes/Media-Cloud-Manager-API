import { StatusCode } from "../utils/enums";
import { sendStatusCodeMessage } from "../utils/send-status-code";
import { BaseError } from "./base.error";

export class ValidationError extends BaseError{
    constructor(statusMessage?: string){
        super(StatusCode.BAD_REQUEST, statusMessage || sendStatusCodeMessage(StatusCode.BAD_REQUEST));
    }
}