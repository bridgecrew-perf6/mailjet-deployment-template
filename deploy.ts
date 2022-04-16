import chalk from "chalk";
import nodeMailjet from "node-mailjet";
import fs from "fs";
import path from "path";
import convertMJMLtoHTML from "./services/mjml-to-html";

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
  console.log(chalk.blue(`Deploy "${templateFolder}"`));

  const templatePath = `./templates/${templateFolder}`;
  const templateRelativePath = `../templates/${templateFolder}`; // used to resolve the modules

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

  // import deploymentParams directly as module
  const { default: deploymentParams } = await import(
    templatePath + "/deploymentParams"
  );

  let mjmlConversionOutput = null;
  try {
    mjmlConversionOutput = convertMJMLtoHTML(mjml);
  } catch (e) {
    console.log(`${templateFolder}'s mjml could not be converted. Skipping...`);
    break;
  }

  const mailjet = nodeMailjet.connect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_API_SECRET
  );

  try {
    await mailjet
      .get("template", { version: "v3" })
      .id(`${deploymentParams.Meta.OwnerType}|${deploymentParams.Meta.Name}`)
      .request();
    console.log(
      chalk.blue("Template already exists. Trying to update details...")
    );
    await mailjet
      .put("template", { version: "v3" })
      .id(`${deploymentParams.Meta.OwnerType}|${deploymentParams.Meta.Name}`)
      .request(deploymentParams.Meta);
    console.log(chalk.green("Template meta info updated"));
  } catch (e: any) {
    console.log(
      chalk.blue("Template does not exist. Trying to create template.")
    );
    await mailjet
      .post("template", { version: "v3" })
      .request(deploymentParams.Meta);
    console.log(chalk.blue("Template created."));
  }

  try {
    await mailjet
      .post("template", { version: "v3" })
      .id(`${deploymentParams.Meta.OwnerType}|${deploymentParams.Meta.Name}`)
      .action("detailcontent")
      .request({
        Headers: deploymentParams.Headers,
        "Html-part": mjmlConversionOutput.html,
      });
    console.log(chalk.green("Template details updated"));
  } catch (e: any) {
    console.log(e);
    console.log(`${deploymentParams.Meta.Name}`);
    console.log(chalk.red("Could not update template details"));
  }

  await new Promise((resolve) => setTimeout(resolve, 10000));
}
