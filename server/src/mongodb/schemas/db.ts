import mongoose, { Document, Schema } from "mongoose";

interface IBackup {
  id: string;
  date: number;
  dest: string;
}

interface ILog {
  date: number;
  message: string;
}

interface ISchema {
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

const DatabaseSchema = new Schema<ISchema>({
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

export const dbModel = mongoose.model<ISchema>("database", DatabaseSchema);
export interface IDatabase extends Omit<ISchema, "id">, Document {}
