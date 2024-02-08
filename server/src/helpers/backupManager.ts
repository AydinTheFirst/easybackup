import { IDatabase, IDest, dbModel, destModel } from "@/mongodb";
import Easybackup from "easybackup.js";
import cron from "node-cron";
import fs from "node:fs";
import { S3 } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

export class BackupManager {
  private dir: string;
  private maxBackup: number;
  private maxLogs: number;

  s3: S3Manager;
  constructor() {
    this.dir = "./public/backups";
    this.maxBackup = 3;
    this.maxLogs = 30;
    this.s3 = new S3Manager(this);
    cron.schedule("0 0,12 * * * ", this.backupAll);
  }

  backupAll = () => {
    dbModel.find().then((dbs) => {
      dbs.forEach((db) => {
        this.backup(db.id);
      });
    });
  };

  async backup(dbId: string) {
    const { db, dest } = await this.findDb(dbId);
    if (!db || !dest) throw new Error("Database is not found!");

    let outFile = "";

    switch (db.type) {
      case "mongodb":
        outFile = await Easybackup.mongodb.dump(db.connectionURL, this.dir);
        break;
      default:
        throw new Error("Unknown database type");
    }

    const key = `${db.name}_${db.id}/${new Date()}.zip`;

    await this.s3.uploadFile(dest, outFile, key);

    if (db.backups.length >= this.maxBackup) {
      const oldest = this.getOldestBackup(db.backups);
      await this.s3.deleteFile(dest, oldest.dest);
      db.backups = db.backups.filter((b) => b.id !== oldest.id);
      this.log(
        db,
        `Backup is deleted from ${dest.name} | Reason: Max backup limit is reached`
      );
    }

    const backup = {
      date: Date.now(),
      dest: key,
      id: randomUUID(),
    };
    db.backups.push(backup);

    this.log(db, `Backup is created and uploaded to ${dest.name}`);

    await db.save();

    return outFile;
  }

  findDb = async (id: string) => {
    const db = await dbModel.findOne({ id });
    const dest = await destModel.findOne({ id: db?.destination });
    return {
      db,
      dest,
    };
  };

  getOldestBackup = (backups: IDatabase["backups"]) => {
    return backups.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    })[0];
  };

  log = async (db: IDatabase, message: string) => {
    db.logs.push({
      date: Date.now(),
      message,
    });

    db.logs = db.logs.slice(0, this.maxLogs);
  };

  verifyDB = async (db: IDatabase) => {
    switch (db.type) {
      case "mongodb":
        return await Easybackup.mongodb.verify(db.connectionURL);
      default:
        throw new Error("Unknown database type");
    }
  };
}

class S3Manager {
  base: BackupManager;
  constructor(base: BackupManager) {
    this.base = base;
  }

  _verify = async (data: IDest) => {
    const client = this._create(data);

    const res = await client.getBucketAcl({
      Bucket: data.bucket,
    });

    return res;
  };

  _create = (data: IDest) => {
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

    const client = this._create(dest);

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
    const client = this._create(dest);

    const res = await client.deleteObject({
      Bucket: dest.bucket,
      Key,
    });

    return res;
  };

  getFile = async (dest: IDest, Key: string) => {
    const client = this._create(dest);

    const { Body } = await client.getObject({
      Bucket: dest.bucket,
      Key,
    });

    if (!Body) throw new Error("File is not found!");

    const bytes = await Body.transformToByteArray();

    const f = `public/backups/${randomUUID()}.zip`;

    fs.writeFileSync(f, Buffer.from(bytes));

    return f;
  };
}
