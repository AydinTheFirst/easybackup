import { userModel } from "../mongodb/schemas/user.js";
import crypto from "node:crypto";

export const genToken = async () => {
  let token = "";
  const generate = () => {
    token = crypto.randomUUID();
  };

  const users = await userModel.find().lean();

  do {
    generate();
  } while (users.find((u) => u.token === token));

  return token;
};

export const uuid = () => {
  return crypto.randomUUID();
};
