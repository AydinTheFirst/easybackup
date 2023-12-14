import mongoose, { Schema } from "mongoose";

export interface IDest {
  id: string;
  ownerId: string;
  name: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  region: string;
  endpoint: string;
}

const DestSchema = new Schema<IDest>({
  id: { type: String, unique: true },
  ownerId: { type: String, required: true },
  name: { type: String, unique: true },
  accessKeyId: { type: String, required: true },
  secretAccessKey: { type: String, required: true },
  bucket: { type: String, required: true },
  region: { type: String, required: true },
  endpoint: { type: String, required: true },
});

export const destModel = mongoose.model<IDest>("dest", DestSchema);
