import { Email } from "node-mailjet";

export interface SendParams extends Email.SendParamsMessage {
  TemplateErrorReporting?: {
    Email: string;
  };
}
