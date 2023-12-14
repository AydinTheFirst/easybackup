import express from "express";
import { v4 } from "uuid";

import { isLoggedIn } from "../helpers/passport";
import { IUser } from "../helpers/schemas/user";
import { APIError } from "./helper.router";
import { IDatabase, dbModel } from "../helpers/schemas/db";
import { destModel } from "../helpers/schemas/dest";
import { backupManager } from "..";

const router = express.Router();
export const DBRouter = router;

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
    await verifyDB(data);
  } catch (error) {
    return APIError(res, String(error));
  }

  const db = await dbModel.create({
    id: v4(),
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
    await verifyDB(data);
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

router.post("/backups/:id", isLoggedIn, async (req, res) => {
  const modelId = req.params.id;
  const { id } = req.user as IUser;

  const model = await dbModel.findOne({ id: modelId, ownerId: id });
  if (!model) return APIError(res, "Model is not found!");

  const dest = await destModel.findOne({ id: model.destination });
  if (!dest) return APIError(res, "Destination is not found!");

  try {
    const v = await backupManager.backup(model, dest);

    model.backups.push({
      date: Date.now(),
      dest: v as string,
      id: v4(),
    });

    await model.save();

    res.send({ message: "OK" });
  } catch (error) {
    return APIError(res, String(error));
  }
});

router.delete("/backups/:id", isLoggedIn, async (req, res) => {
  const bid = req.params.id;
  const modelId = req.body.modelId;
  const { id } = req.user as IUser;

  if (!bid) return APIError(res, "Unknown backup id");

  const model = await dbModel.findOne({ id: modelId, ownerId: id });
  if (!model) return APIError(res, "Model is not found!");

  const dest = await destModel.findOne({ id: model.destination });

  if (dest) {
    const backup = model.backups.find((b) => b.id === bid);
    if (!backup) return;
    backupManager.s3.deleteFile(dest, backup.dest);
  }

  backupManager.log(model, `Backup is removed with id ${bid}`);

  model.backups = model.backups.filter((b) => b.id !== bid);

  await model.save();

  res.send({ message: "OK" });
});

const verifyDB = async (data: IDatabase) => {
  switch (data.type) {
    case "mongodb":
      await backupManager.mongo.connect(data.connectionURL);
      break;
  }
};
