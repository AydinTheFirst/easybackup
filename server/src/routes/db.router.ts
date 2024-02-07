import express from "express";

import { isLoggedIn } from "../helpers/passport";
import { IUser } from "../mongodb/schemas/user";
import { APIError } from "./helper.router";
import { dbModel } from "../mongodb/schemas/db";
import { destModel } from "../mongodb/schemas/dest";
import { uuid } from "@/helpers/utils";
import { BackupsRouter } from "./backups.router";

import { backupManager } from "@";

const router = express.Router();
export { router as DBRouter };

router.use(
  "/:id/backups",
  (req, res, next) => {
    req.dbId = req.params.id;
    next();
  },
  BackupsRouter
);

router.get("/", isLoggedIn, async (req, res) => {
  const { id } = req.user as IUser;
  const models = await dbModel.find({ ownerId: id });

  return res.send(models);
});

router.get("/:id", isLoggedIn, async (req, res) => {
  const modelId = req.params.id;
  const { id } = req.user as IUser;

  const model = await dbModel.findOne({ id: modelId, ownerId: id });
  if (!model) return APIError(res, "Model is not found!");

  await model.save();

  return res.send(model?.toJSON());
});

router.post("/", isLoggedIn, async (req, res) => {
  const { id } = req.user as IUser;
  const data = req.body;

  try {
    await backupManager.verifyDB(data);
  } catch (error) {
    return APIError(res, String(error));
  }

  const db = await dbModel.create({
    id: uuid(),
    ownerId: id,
    ...req.body,
  });

  backupManager.log(db, `Database is added to easybackup`);

  res.send({ message: "OK" });
});

router.put("/:id", isLoggedIn, async (req, res) => {
  const modelId = req.params.id;
  const { id } = req.user as IUser;
  const data = req.body;

  try {
    await backupManager.verifyDB(data);
  } catch (error) {
    return APIError(res, String(error));
  }

  const model = await dbModel.findOne({ id: modelId, ownerId: id });
  if (!model) return APIError(res, "Model is not found!");

  Object.assign(model, data);

  backupManager.log(model, `Database is updated`);

  await model.save();

  res.send({ message: "OK" });
});

router.delete("/:id", isLoggedIn, async (req, res) => {
  const modelId = req.params.id;
  const force = req.body.force;
  const { id } = req.user as IUser;

  const model = await dbModel.findOne({ id: modelId, ownerId: id });
  if (!model) return APIError(res, "Model is not found!");

  const dest = await destModel.findOne({ id: model.destination });
  if (!dest) return APIError(res, "Destination is not found!");

  if (force) {
    model.backups.forEach(async (b) => {
      backupManager.s3.deleteFile(dest, b.dest);
    });
  }

  await model.deleteOne();

  res.send({ message: "OK" });
});
