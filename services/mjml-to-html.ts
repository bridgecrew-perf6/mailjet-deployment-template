import mjml2html from "mjml";
import lodash from "lodash";
import process from "process";
import chalk from "chalk";

const convertMJMLtoHTML = (mjml: string) => {
  const mjmlOutput = mjml2html(mjml, {
    filePath: "./templates/_composables",
    preprocessors: [
      (data) =>
        lodash.template(data)({
          environment: process.env.ENVIRONMENT,
        }),
    ],
  });

  if (mjmlOutput.errors.length > 0) {
    mjmlOutput.errors.forEach((error) => {
      console.log(chalk.red(error.formattedMessage), error.line, error.tagName);
    });
    throw new Error("MJML Conversion failed");
  }

  return mjmlOutput;
};

export default convertMJMLtoHTML;
