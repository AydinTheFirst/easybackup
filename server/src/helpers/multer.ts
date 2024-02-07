import multer from "multer";
import fs from "node:fs";
import { uuid } from "./utils";

const folder = "public";

const dir = fs.existsSync(folder);
if (!dir) fs.mkdirSync(folder);

const storage = multer.diskStorage({
  destination: folder,
  filename: (req: any, file: any, cb: Function) => {
    cb(null, uuid() + "." + file.mimetype.split("/")[1]);
  },
});

export const upload = multer({ storage: storage });
