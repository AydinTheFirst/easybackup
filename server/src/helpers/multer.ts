// @ts-ignore: Could not find a declaration file for module
import multer from "multer";
// @ts-ignore: Could not find a declaration file for module
import { v4 as uuid } from "uuid";
import * as fs from "fs";

const dir = fs.existsSync("uploads");
if (!dir) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req: any, file: any, cb: Function) => {
    cb(null, uuid() + "." + file.mimetype.split("/")[1]);
  },
});

export const upload = multer({ storage: storage });
