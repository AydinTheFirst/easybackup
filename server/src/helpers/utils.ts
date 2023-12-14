import { v4 } from "uuid";
import { userModel } from "./schemas/user.js";

import crypto from "crypto-js";

export const genToken = async (length = 128) => {
  let token = "";
  const generate = () => {
    token = v4();
  };

  const users = await userModel.find().lean();

  do {
    generate();
  } while (users.find((u) => u.token === token));

  return token;
};

export const encrypt = (data: string) => {
  return crypto.AES.encrypt(data, process.env.secret_key as string);
};

export const decrypt = (data: string) => {
  const bytes = crypto.AES.decrypt(data, process.env.secret_key as string);

  return bytes.toString(crypto.enc.Utf8);
};
