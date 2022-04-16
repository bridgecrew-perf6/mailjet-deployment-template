import * as fs from "fs";
import * as path from "path";
import * as Module from "module";
import { DeploymentParams } from "../types/DeploymentParams";

export default async () => {
  const templateName = process.argv[2];
  const templateFolder = `./templates/${templateName}`;
  const templateFolderRelative = `../templates/${templateName}`;

  try {
    fs.readdirSync(templateFolder);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      throw new Error("Error: this template does not exist.");
    }
  }

  // import mjml file as string
  const mjml = fs
    .readFileSync(path.join(templateFolder, "index.mjml"))
    .toString();

  // import variables directly as module
  const { default: variables } = (await import(
    path.join(templateFolderRelative, "variables")
  )) as { default: Object };

  // import variables directly as module
  const { default: deploymentParams } = (await import(
    path.join(templateFolderRelative, "deploymentParams")
  )) as { default: DeploymentParams };

  return {
    mjml,
    variables,
    deploymentParams,
  };
};
