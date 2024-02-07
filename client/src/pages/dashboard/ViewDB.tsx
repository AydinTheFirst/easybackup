import { Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { FaDatabase, FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";

import { DashboardLayout } from "@/layouts/Dashboard";
import { SelectInput } from "@/components/Inputs";
import { toast } from "@/components/Toast";

import { IBackup, IDatabase, useDatabase } from "@/hooks/useDatabases";
import { useDestinations } from "@/hooks/useDestinations";

import { API, Routes, http } from "@/http";
import { useEffect, useRef, useState } from "react";
import { FaArrowsRotate, FaTriangleExclamation } from "react-icons/fa6";

export const ViewDB = () => {
  const dbId = useParams<{ id: string }>().id;
  const { database } = useDatabase(dbId!);
  const { destinations } = useDestinations();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    database ? update(form) : create(form);
  };

  const create = async (data: FormData) => {
    try {
      await http.post(Routes.Databases(), data);
      toast({
        title: "Database Created",
        message: "Database has been created successfully",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const update = async (data: FormData) => {
    try {
      await http.put(Routes.Databases(dbId), data);
      toast({
        title: "Database Updated",
        message: "Database has been updated successfully",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const remove = async () => {
    const ok = confirm("Are you sure you want to delete this database?");
    if (!ok) return;

    try {
      await http.delete(Routes.Databases(dbId), null);
      toast({
        title: "Database Deleted",
        message: "Database has been deleted successfully",
      });
      location.replace("/dashboard/databases");
    } catch (error) {
      console.error(error);
    }
  };

  console.log(database);

  return (
    <DashboardLayout>
      <div className="container">
        {database && <DatabaseController db={database} />}

        <br />
        <form action="" className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <Label className="mb-2 block">Database Name</Label>
            <TextInput
              name="name"
              placeholder="Database Name"
              sizing={"sm"}
              defaultValue={database?.name}
              required
            />
          </div>
          <div className="col-md-6">
            <Label className="mb-2 block">Database Type</Label>
            <SelectInput
              name="type"
              defaultValue={database?.type ?? ""}
              onChange={() => {}}
              options={[{ id: "mongodb", name: "MongoDB" }]}
            />
          </div>
          <div className="col-md-6">
            <Label className="mb-2 block">Destination</Label>
            <SelectInput
              name="destination"
              defaultValue={database?.destination ?? ""}
              onChange={() => {}}
              options={destinations}
            />
          </div>
          <div className="col-md-6">
            <Label className="mb-2 block">Connection URL</Label>
            <TextInput
              name="connectionURL"
              placeholder="Connection URL"
              sizing={"sm"}
              defaultValue={database?.connectionURL}
              required
            />
          </div>
          <div className="col-12">
            {database ? (
              <Button type="submit" color="green" size={"sm"}>
                <FaSave className="me-2" />
                Save
              </Button>
            ) : (
              <Button type="submit" color="blue" size={"sm"}>
                <FaDatabase className="me-2" />
                Create
              </Button>
            )}
          </div>
          {database && (
            <div className="col-12 flex justify-end">
              <Button onClick={remove} color="red" size={"sm"}>
                Delete
              </Button>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
};

interface DatabaseControllerProps {
  db: IDatabase;
}

const DatabaseController = ({ db }: DatabaseControllerProps) => {
  const logs = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logs.current?.scrollTo({
      behavior: "smooth",
      top: logs.current.scrollHeight,
      left: 0,
    });
  }, [db.logs]);

  const backup = async () => {
    try {
      await http.post(Routes.Databases(db.id) + "/backups", null);
      toast({
        title: "Backup Started",
        message: "Backup has been started successfully",
      });
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="row g-3">
        <div className="col-12">
          <div className="mb-2 block">
            <h3 className="text-lg font-bold">Logs</h3>
          </div>
          <div
            ref={logs}
            className="h-[200px] overflow-auto rounded bg-black p-3"
            style={{
              fontFamily: "monospace",
            }}
          >
            {db.logs.map((log) => (
              <>
                <code>
                  <span className="me-3 text-green-600">
                    {new Date(log.date).toLocaleString()}
                  </span>
                  {log.message}
                </code>
                <br />
              </>
            ))}
          </div>
        </div>
        <div className="col-md-12">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-lg font-bold">Backups</div>
            <Button color="blue" size={"xs"} onClick={backup}>
              Manual Backup
            </Button>
          </div>
          <BackupTable db={db} />
        </div>
      </div>
      <br />
      <br />
    </>
  );
};

interface BackupTableProps {
  db: IDatabase;
}

const BackupTable = ({ db }: BackupTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead />
        <Table.Body className="divide-y">
          {db.backups.map((backup, i) => (
            <TableRow key={backup.id} backup={backup} i={i} />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

const TableHead = () => {
  return (
    <Table.Head>
      <Table.HeadCell>#</Table.HeadCell>
      <Table.HeadCell>Date</Table.HeadCell>
      <Table.HeadCell>Destination</Table.HeadCell>
      <Table.HeadCell>#</Table.HeadCell>
      <Table.HeadCell>#</Table.HeadCell>
      <Table.HeadCell>#</Table.HeadCell>
    </Table.Head>
  );
};

const TableRow = ({ backup, i }: { backup: IBackup; i: number }) => {
  const dbId = useParams<{ id: string }>().id;

  const [openModal, setOpenModal] = useState(false);

  const remove = async () => {
    try {
      await http.delete(Routes.Databases(dbId) + "/backups/" + backup.id, {
        id: backup.id,
      });
      toast({
        title: "Backup Deleted",
        message: "Backup has been deleted successfully",
      });
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const getBackup = async () => {
    try {
      const data = await http.get(
        Routes.Databases(dbId) + "/backups/" + backup.id,
        {
          id: backup.id,
        },
      );
      const url = API.replace("/api", "/") + data.file;

      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
        <Table.Cell>{i + 1}</Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
          {new Date(backup.date).toLocaleString()}
        </Table.Cell>
        <Table.Cell className="backup-dest max-w-sm">
          <div
            style={{
              overflow: "auto",
              textWrap: "nowrap",
            }}
          >
            {backup.dest}
          </div>
        </Table.Cell>
        <Table.Cell>
          <Button color="blue" size={"xs"} onClick={getBackup}>
            Download
          </Button>
        </Table.Cell>
        <Table.Cell>
          <Button color="green" size={"xs"} onClick={() => setOpenModal(true)}>
            Restore
          </Button>
        </Table.Cell>
        <Table.Cell>
          <Button color="red" size={"xs"} onClick={remove}>
            Delete
          </Button>
        </Table.Cell>
      </Table.Row>

      <RestoreModal
        backup={backup}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

interface RestoreModalProps {
  backup: IBackup;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

const RestoreModal = ({
  backup,
  openModal,
  setOpenModal,
}: RestoreModalProps) => {
  const dbId = useParams<{ id: string }>().id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const url = Routes.Databases(dbId) + "/backups/" + backup.id + "/restore";

    try {
      await http.post(url, form);
      toast({
        title: "Restore Started",
        message: "Restore has been started successfully",
      });
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        className="dark:bg-black"
      >
        <Modal.Header>Restore Backup</Modal.Header>
        <Modal.Body className="dark:bg-slate-800 dark:text-white">
          <div className="mb-2 flex justify-center">
            <FaTriangleExclamation className="text-5xl text-red-500" />
          </div>
          <div className="text-center text-lg font-bold text-red-900 dark:text-red-100">
            Are you sure you want to restore this backup?
            <br />
            <span className="text-red-500">
              All the data will be replaced with the backup data
            </span>
          </div>
          <br />
          <form action="" className="row g-3" onSubmit={handleSubmit}>
            <div>
              <Label className="mb-2 block">ConnectionURL</Label>
              <TextInput
                name="connectionURL"
                placeholder="ConnectionURL"
                sizing={"sm"}
                required
                helperText={
                  <>
                    Please enter the connection URL to restore the backup
                    <span className="ms-3 text-red-500">
                      You cant restore a backup to another type of database!
                    </span>
                  </>
                }
              />
            </div>
            <div>
              <Button type="submit" color="green" size={"sm"}>
                <FaArrowsRotate className="me-2" />
                Restore
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
