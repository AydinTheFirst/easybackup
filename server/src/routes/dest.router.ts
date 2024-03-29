import express from "express";

import { isLoggedIn } from "../helpers/passport";
import { destModel } from "../mongodb/schemas/dest";
import { IUser } from "../mongodb/schemas/user";
import { APIError } from "./helper.router";

import { backupManager } from "..";
import { dbModel } from "../mongodb/schemas/db";
import { uuid } from "@/helpers/utils";

const router = express.Router();
export const DestRouter = router;

router.get("/", isLoggedIn, async (req, res) => {
  const { id } = req.user as IUser;
  const models = await destModel.find({ ownerId: id });

  return res.send(models);
});

router.get("/:id", isLoggedIn, async (req, res) => {
  const modelId = req.params.id;
  const { id } = req.user as IUser;

  const model = await destModel.findOne({ id: modelId, ownerId: id }).lean();

  return res.send(model);
});

router.post("/", isLoggedIn, async (req, res) => {
  const { id } = req.user as IUser;
  const data = req.body;

  try {
    await backupManager.s3._verify(data);

    await destModel.create({
      id: uuid(),
      ownerId: id,
      ...req.body,
    });

    res.send({ message: "OK" });
  } catch (error) {
    return APIError(res, String(error));
  }
});

router.put("/:id", isLoggedIn, async (req, res) => {
  const modelId = req.params.id;
  const { id } = req.user as IUser;
  const data = req.body;
  // Check

  const model = await destModel.findOne({ id: modelId, ownerId: id });
  if (!model) return APIError(res, "Model is not found!");

  console.log(data.secretAccessKey);

  // Verfiy
  try {
    await backupManager.s3._verify(data);

    Object.assign(model, data);
    await model.save();

    res.send({ message: "OK" });
  } catch (error) {
    return APIError(res, String(error));
  }
});

router.delete("/:id", isLoggedIn, async (req, res) => {
  const modelId = req.params.id;
  const { id } = req.user as IUser;

  const model = await destModel.findOne({ id: modelId, ownerId: id });
  if (!model) return APIError(res, "Model is not found!");

  const dbs = await dbModel.find({ ownerId: id, destination: modelId });
  if (dbs.length > 0)
    return APIError(
      res,
      "You need to remove all databases that use this destination first!"
    );

  await model.deleteOne();

  res.send({ message: "OK" });
});
