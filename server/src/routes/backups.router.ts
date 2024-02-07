import express from "express";
import fs from "node:fs";

import { isLoggedIn } from "@/helpers/passport";
import { IUser, dbModel, destModel } from "@/mongodb";
import { APIError } from "./helper.router";
import { backupManager } from "@";
import { ADDRGETNETWORKPARAMS } from "node:dns";
import Easybackup from "easybackup.js";

const router = express.Router();
export { router as BackupsRouter };

router.get("/:id", isLoggedIn, async (req, res) => {
  const modelId = req.dbId;
  const { id } = req.user as IUser;

  const model = await dbModel.findOne({ id: modelId, ownerId: id });
  if (!model) return APIError(res, "Model is not found!");

  const backup = model.backups.find((b) => b.id === req.params.id);
  if (!backup) return APIError(res, "Backup is not found!");

  const dest = await destModel.findOne({ id: model.destination });
  if (!dest) return APIError(res, "Destination is not found!");

  const file = await backupManager.s3.getFile(dest, backup.dest);

  setTimeout(() => {
    fs.unlinkSync(file);
  }, 1000 * 60 * 5);

  backupManager.log(model, `Backup is downloaded with id ${backup.id}`);
  await model.save();

  res.send({ file });
});

router.post("/", isLoggedIn, async (req, res) => {
  const modelId = req.dbId;
  const { id } = req.user as IUser;

  const model = await dbModel.findOne({ id: modelId, ownerId: id });
  if (!model) return APIError(res, "Model is not found!");

  const dest = await destModel.findOne({ id: model.destination });
  if (!dest) return APIError(res, "Destination is not found!");

  try {
    await backupManager.backup(model.id);
    res.send({ message: "OK" });
  } catch (error) {
    return APIError(res, String(error));
  }
});

router.delete("/:id", isLoggedIn, async (req, res) => {
  const modelId = req.dbId;
  const backupId = req.params.id;
  const { id } = req.user as IUser;

  if (!backupId) return APIError(res, "Unknown backup id");

  const model = await dbModel.findOne({ id: modelId, ownerId: id });
  if (!model) return APIError(res, "Model is not found!");

  const dest = await destModel.findOne({ id: model.destination });

  if (dest) {
    const backup = model.backups.find((b) => b.id === backupId);
    if (!backup) return;
    backupManager.s3.deleteFile(dest, backup.dest);
  }

  backupManager.log(model, `Backup is removed with id ${backupId}`);

  model.backups = model.backups.filter((b) => b.id !== backupId);

  await model.save();

  res.send({ message: "OK" });
});

router.post("/:id/restore", isLoggedIn, async (req, res) => {
  const modelId = req.dbId;
  const backupId = req.params.id;
  const { id } = req.user as IUser;

  console.log(req.body);

  if (!backupId) return APIError(res, "Unknown backup id");

  const model = await dbModel.findOne({ id: modelId, ownerId: id });
  if (!model) return APIError(res, "Model is not found!");

  const dest = await destModel.findOne({ id: model.destination });
  if (!dest) return APIError(res, "Destination is not found!");

  const backup = model.backups.find((b) => b.id === backupId);
  if (!backup) return APIError(res, "Backup is not found!");

  const file = await backupManager.s3.getFile(dest, backup.dest);
  switch (model.type) {
    case "mongodb":
      await Easybackup.mongodb.restore(req.body.connectionURL, file);
      break;
    default:
      return APIError(res, "Unknown model type");
  }

  fs.unlinkSync(file);

  res.send({ message: "OK" });
});
