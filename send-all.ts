import chalk from "chalk";
import nodeMailjet from "node-mailjet";
import fs from "fs";
import path from "path";
import convertMJMLtoHTML from "./services/mjml-to-html";
import { SendParams } from "./types/SendParamsMessage";
import process from "process";
import sendEmail from "./services/send-email";
import readFiles from "./services/read-files";

// 1) read files
const templatesPath = `./templates/`;
let templateFolders: string[] = [];

try {
  templateFolders = fs
    .readdirSync(templatesPath)
    .filter((e) => !e.startsWith("_"));
} catch (e: any) {
  if (e.code === "ENOENT") {
    throw new Error("Error: this template does not exist.");
  }
}

for (const templateFolder of templateFolders) {
  console.log(chalk.blue(`Send "${templateFolder}"`));

  const templatePath = `./templates/${templateFolder}`;

  // import deploymentParams directly as module
  const { default: variables } = await import(templatePath + "/variables");

  if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_API_SECRET) {
    throw new Error("MAILJET_API_KEY / MAILJET_API_SECRET not set");
  }

  // make sure read path is a folder
  try {
    fs.readdirSync(templatePath);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      console.log(
        chalk.red(`Error: Path ${templatePath} is not a folder. Skipping...`)
      );
      break;
    }
  }

  // read mjml file as string
  const mjml = fs
    .readFileSync(path.join(templatePath, "index.mjml"))
    .toString();

  let mjmlConversionOutput = null;
  try {
    mjmlConversionOutput = convertMJMLtoHTML(mjml);
  } catch (e) {
    console.log(`${templateFolder}'s mjml could not be converted. Skipping...`);
    break;
  }

  let emailData: SendParams = {
    HTMLPart: mjmlConversionOutput.html,
    Variables: variables,
    From: {
      Email: process.env.MAILJET_SENDER_EMAIL!, // should be a validated address
      Name: "Test Sender Batch",
    },
    TemplateErrorReporting: {
      Email: process.env.TEMPLATE_ERROR_REPORTING!,
    },
    Subject: "Test E-Mail Batch",
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

  await new Promise((resolve) => setTimeout(resolve, 1000));
}
