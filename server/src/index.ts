import "dotenv/config";
import "./helpers/mongodb.js";
// Run server
import "./server";

import { BackupManager } from "./helpers/backupManager.js";

export const backupManager = new BackupManager();

// Handle errors
process.on("unhandledRejection", (reason, promise) => {
  console.log(reason);
});
