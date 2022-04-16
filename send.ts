import readFiles from "./services/read-files";
import sendEmail from "./services/send-email";
import chalk from "chalk";
import { SendParams } from "./types/SendParamsMessage";
import * as process from "process";
import convertMJMLtoHTML from "./services/mjml-to-html";

const { mjml, variables } = await readFiles();

const mjmlConversionOutput = convertMJMLtoHTML(mjml);

let emailData: SendParams = {
  HTMLPart: mjmlConversionOutput.html,
  Variables: variables,
  From: {
    Email: process.env.MAILJET_SENDER_EMAIL!, // should be a validated address
    Name: "Test Sender",
  },
  TemplateErrorReporting: {
    Email: process.env.TEMPLATE_ERROR_REPORTING!,
  },
  Subject: "Test E-Mail MailJet",
  TemplateLanguage: true,
  To: [
    {
      Email: process.env.MAILJET_RECIPIENT_EMAIL!,
      Name: "Test E-Mail",
    },
  ],
};

try {
  const senderSuccess = await sendEmail(emailData);
  console.log(chalk.green(senderSuccess?.message), senderSuccess?.data);
} catch (senderError: any) {
  console.error(chalk.red(senderError));
}
