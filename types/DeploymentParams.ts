export interface DeploymentParams {
  Headers: {
    From: string;
    Subject: string;
    "Reply-to": string;
  };
  Meta: {
    Name: string;
    Author: string;
    Copyright: string;
    Description: string;
    EditMode: number;
    IsStarred: boolean;
    IsTextPartGenerationEnabled: boolean;
    Locale: string;
    OwnerType: string;
    Presets: string;
    Purposes: ["transactional"];
  };
}
