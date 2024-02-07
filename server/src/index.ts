import "dotenv/config";
import "./mongodb";

// Run server
import "./server";

import { BackupManager } from "./helpers/backupManager";

export const backupManager = new BackupManager();

// Handle errors
process.on("unhandledRejection", (reason, promise) => {
  console.log(reason);
});
