import { StatusCode } from "../utils/enums.js";
import { sendStatusCodeMessage } from "../utils/send-status-code.js";
import { BaseError } from "./base.error.js";

export class ValidationError extends BaseError{
    constructor(statusMessage?: string){
        super(StatusCode.BAD_REQUEST, statusMessage || sendStatusCodeMessage(StatusCode.BAD_REQUEST));
    }
}