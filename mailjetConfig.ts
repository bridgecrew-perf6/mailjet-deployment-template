const mailjetConfig = {
  FromEmail: process.env.MAILJET_SENDER_EMAIL, // should be a validated address from your account
  FromName: "Test Sender",
  Subject: "Test E-Mail MailJet",
  "Mj-Templateerrorreporting": process.env.TEMPLATE_ERROR_REPORTING, // specify this address to access debug reports
  "MJ-TemplateLanguage": true, // mandatory
  Recipients: [
    {
      Email: process.env.TEMPLATE_ERROR_REPORTING,
      Name: "Test E-Mail",
    },
  ],
};

export default mailjetConfig;
