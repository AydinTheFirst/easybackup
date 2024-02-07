import { http } from "@/http";
import { useEffect, useState } from "react";

export const useDatabases = () => {
  const [databases, setDatabases] = useState<IDatabase[]>([]);

  const fetchDatabases = async () => {
    try {
      const data = await http.get("/databases", null);

      setDatabases(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDatabases();
  }, []);

  return { databases, setDatabases, fetchDatabases };
};

export const useDatabase = (id: string) => {
  const [database, setDatabase] = useState<IDatabase>();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await http.get(`/databases/${id}`, null);

        setDatabase(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id !== "create") fetch();
  }, [id]);

  return { database, setDatabase };
};

export interface IBackup {
  id: string;
  date: number;
  dest: string;
}

export interface ILog {
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
