import {
  DeleteObjectCommand,
  GetBucketAclCommand,
  S3,
} from "@aws-sdk/client-s3";

import { v4 } from "uuid";
import fs from "fs";
import mongoose from "mongoose";
import AdmZip from "adm-zip";
import cron from "node-cron";

// Types
import { IDest, destModel } from "./schemas/dest";
import { IDatabase, dbModel } from "./schemas/db";

/** Base backup manager */
export class BackupManager {
  backupDir: string;
  maxBackups: number;
  maxLogs: number;
  s3: S3Manager;
  mongo: MongoManager;
  constructor() {
    this.backupDir = "./src/backups";

    this.maxBackups = 3;
    this.maxLogs = 50;

    this.s3 = new S3Manager(this);
    this.mongo = new MongoManager(this);

    cron.schedule("0 0,12 * * * ", this.backupAll);
  }

  backupAll = async () => {
    // Fetch all databases and destinations
    const allDatabases = await dbModel.find();
    const allDestinations = await destModel.find();

    // Run backup operations concurrently for each database
    await Promise.all(
      allDatabases.map(async (database) => {
        // Find the corresponding destination for the current database
        const destination = allDestinations.find(
          (dest) => dest.id === database.destination
        );

        // If there's no destination or the database is not enabled, skip the backup
        if (!destination || !database.enabled) return;

        // Perform the backup
        try {
          const backupResult = await this.backup(database, destination);
          database.backups.push({
            id: v4(),
            date: Date.now(),
            dest: backupResult as string,
          });

          this.log(
            database,
            `Cron Job | Backup is created and uploaded to ${destination.name}`
          );

          await database.save();
        } catch (error) {
          this.log(database, String(error));
        }
      })
    );
  };

  backup = async (db: IDatabase, dest: IDest) => {
    const database = await this.findDatabase(db.id);

    if (db.backups.length >= this.maxBackups) {
      if (!database) throw new Error("Database is not found!");

      const oldest = this.getOldestBackup(database.backups);
      database.backups = this.removeBackup(database.backups, oldest.id);
      await this.s3.deleteFile(dest, oldest.dest);
      await database.save();
    }

    if (db.type === "mongodb") {
      const s = await this.mongo.backup(db, dest);
      this.log(db, `Backup is created and uploaded to ${dest.name}`);
      return s;
    } else {
      throw new Error("Undefined db type!");
    }
  };

  findDatabase = async (id: string) => {
    return await dbModel.findOne({ id });
  };

  getOldestBackup = (backups: IDatabase["backups"]) => {
    return backups.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    })[0];
  };

  removeBackup = (backups: IDatabase["backups"], id: string) => {
    return backups.filter((b) => b.id !== id);
  };

  createZip = async (data: any[], dirName: string) => {
    const zip = new AdmZip();

    for (const c of data) {
      zip.addFile(
        `${c.name}_${Date.now()}.json`,
        Buffer.from(JSON.stringify(c.data)),
        "Created with easybackup"
      );
    }

    const target = `./src/backups/${dirName}_${Date.now()}.zip`;

    zip.writeZip(target);

    return target;
  };

  log = async (database: IDatabase, log: string) => {
    const db = await this.findDatabase(database.id);

    if (!db) return;

    if (db.logs.length >= this.maxLogs) {
      db.logs = db.logs.slice(1);
    }

    db.logs.push({
      date: Date.now(),
      message: log,
    });

    await db.save();

    return this;
  };
}

class S3Manager {
  base: BackupManager;
  constructor(base: BackupManager) {
    this.base = base;
  }

  _verifyStorageClient = async (data: IDest) => {
    const client = this._createStorageClient(data);

    const cmd = new GetBucketAclCommand({
      Bucket: data.bucket,
    });

    await client.send(cmd);
  };

  _createStorageClient = (data: IDest) => {
    const client = new S3({
      endpoint: data.endpoint,
      region: data.region,
      credentials: {
        accessKeyId: data.accessKeyId,
        secretAccessKey: data.secretAccessKey,
      },
    });

    return client;
  };

  uploadFile = async (dest: IDest, src: string, Key: string) => {
    const file = fs.readFileSync(src);

    const client = this._createStorageClient(dest);

    await client.putObject({
      Key,
      Bucket: dest.bucket,
      Body: file,
      ContentType: "application/zip",
    });

    fs.unlinkSync(src);

    return Key;
  };

  deleteFile = async (dest: IDest, Key: string) => {
    const command = new DeleteObjectCommand({
      Bucket: dest.bucket,
      Key,
    });
    const client = this._createStorageClient(dest);

    return await client.send(command);
  };

  getFile = async (dest: IDest, Key: string) => {
    const client = this._createStorageClient(dest);

    const res = await client.getObject({
      Bucket: dest.bucket,
      Key,
    });

    return res.Body;
  };
}

class MongoManager {
  base: BackupManager;
  constructor(base: BackupManager) {
    this.base = base;
  }

  backup = async (database: IDatabase, dest: IDest) => {
    const mongo = await this.connect(database.connectionURL);
    const db = mongo.db;

    const collections = await db.listCollections().toArray();

    const arr: any[] = [];

    for (const c of collections) {
      const data = await db.collection(c.name).find().toArray();
      arr.push({ name: c.name, data });
    }

    const target = await this.base.createZip(arr, database.name);

    const fileName = database.name + "_" + v4() + "/" + Date.now() + ".zip";
    const key = await this.base.s3.uploadFile(dest, target, fileName);

    return key;
  };

  connect = (url: string): Promise<mongoose.Connection> => {
    const conn = mongoose.createConnection(url);
    return new Promise((resolve, reject) => {
      conn.on("error", (error) => {
        reject(error);
      });

      conn.on("connected", () => {
        resolve(conn);
      });
    });
  };
}
