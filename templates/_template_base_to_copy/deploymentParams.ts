import { DeploymentParams } from "../../types/DeploymentParams";

const deploymentParams: DeploymentParams = {
  Headers: {
    From: "Company Name <test@example.de>",
    Subject: "NAME",
    "Reply-to": "test@example.de",
  },
  Meta: {
    // If you change this name the email might be deployed again
    Name: "",
    Author: "NAME",
    Copyright: "NAME",
    Description: "This email informs the user, that ...",
    EditMode: 2,
    IsStarred: false,
    IsTextPartGenerationEnabled: true,
    Locale: "de_DE",
    OwnerType: "user",
    Presets: "string",
    Purposes: ["transactional"],
  },
};

export default deploymentParams;
