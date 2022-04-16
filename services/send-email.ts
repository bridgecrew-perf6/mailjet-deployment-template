import MailjetSender from "./mailjet-sender";
import { SendParams } from "../types/SendParamsMessage";

export default async (emailData: SendParams) => {
  if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_API_SECRET) {
    return;
  }
  const sender = new MailjetSender(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_API_SECRET
  );

  const response = await sender.send(emailData);

  return {
    message:
      "Congratulations, you've just sent an email to the following recipients:",
    data: response[0].To,
  };
};
