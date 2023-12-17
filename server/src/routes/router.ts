import express from "express";

// Routers
import { AuthRouter } from "./auth.router.js";
import { SettingsRouter } from "./settings.router.js";
import { DestRouter } from "./dest.router.js";
import { DBRouter } from "./db.router.js";

const app = express.Router();
export const router = app;

router.use("/auth", AuthRouter);
router.use("/settings", SettingsRouter);
router.use("/destinations", DestRouter);
router.use("/databases", DBRouter);

router.get("/", (req, res) => {
  res.send({ message: "API is working!" });
});
