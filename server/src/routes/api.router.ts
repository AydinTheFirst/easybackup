import express from "express";

// Routers
import { AuthRouter } from "./auth.router.js";
import { DestRouter } from "./dest.router.js";
import { DBRouter } from "./db.router.js";

const router = express.Router();
export { router as ApiRouter };

router.use("/auth", AuthRouter);
router.use("/destinations", DestRouter);
router.use("/databases", DBRouter);

router.get("/", (req, res) => {
  res.send({ message: "API is working!" });
});
