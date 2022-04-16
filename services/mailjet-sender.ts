import nodeMailjet, { Email } from "node-mailjet";
import { SendParams } from "../types/SendParamsMessage";

// simple Sender class using the node.js mailjet wrapper
class Sender {
  sender: nodeMailjet.Email.PostResource;
  // the mailjet sender needs valid credentials
  constructor(APIKey: string, APISecret: string) {
    this.sender = nodeMailjet
      .connect(APIKey, APISecret)
      .post("send", { version: "v3.1" });
  }

  // simple send method – see wrapper documentation for more infos: https://github.com/mailjet/mailjet-apiv3-nodejs
  send = async (data: SendParams) => {
    const result = (await this.sender.request({
      Messages: [data],
    })) as Email.PostResponse;
    return result.body.Messages;
  };
}

export default Sender;
