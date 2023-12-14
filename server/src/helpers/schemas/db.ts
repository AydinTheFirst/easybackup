import mongoose, { Schema } from "mongoose";

interface IBackup {
  id: string;
  date: number;
  dest: string;
}

interface ILog {
  date: number;
  message: string;
}

export interface IDatabase {
  id: string;
  ownerId: string;
  name: string;
  type: string;
  connectionURL: string;
  enabled: boolean;
  backups: IBackup[];
  destination: string;
  logs: ILog[];
}

const DatabaseSchema = new Schema<IDatabase>({
  id: { type: String, unique: true },
  ownerId: { type: String, required: true },
  name: { type: String, unique: true },
  type: { type: String, required: true },
  connectionURL: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  backups: { type: [Object], default: [] },
  destination: { type: String, required: true },
  logs: { type: [Object], default: [] },
});

export const dbModel = mongoose.model<IDatabase>("database", DatabaseSchema);
