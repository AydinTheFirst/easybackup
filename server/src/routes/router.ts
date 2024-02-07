import express from "express";
import { ApiRouter } from "./api.router";

export const router = express.Router();

router.use("/api", ApiRouter);

router.get("*", (req, res) => {
  res.sendFile("index.html", { root: "../client/dist" });
});
