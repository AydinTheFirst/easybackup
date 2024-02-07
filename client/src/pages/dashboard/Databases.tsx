import { TableHeader } from "@/components/Table";
import { IDatabase, useDatabases } from "@/hooks/useDatabases";
import { DashboardLayout } from "@/layouts/Dashboard";
import { Table } from "flowbite-react";

export const Databases = () => {
  return (
    <DashboardLayout>
      <TableHeader
        label="Databases"
        url="/dashboard/databases/create"
        handleSearch={(e) => console.log(e.target.value)}
      />
      <br />

      <DBTable />
    </DashboardLayout>
  );
};

const DBTable = () => {
  const { databases } = useDatabases();

  if (!databases) return null;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead />
        <Table.Body className="divide-y">
          {databases.map((db, i) => (
            <TableRow key={db.id} db={db} i={i} />
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
      <Table.HeadCell>DB Name</Table.HeadCell>
      <Table.HeadCell>Type</Table.HeadCell>
      <Table.HeadCell>Backup Count</Table.HeadCell>
      <Table.HeadCell>
        <span className="sr-only">Edit</span>
      </Table.HeadCell>
    </Table.Head>
  );
};

const TableRow = ({ db, i }: { db: IDatabase; i: number }) => {
  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell>{i + 1}</Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {db.name}
      </Table.Cell>
      <Table.Cell>{db.type}</Table.Cell>
      <Table.Cell>{db.backups.length}</Table.Cell>
      <Table.Cell>
        <a
          href={`/dashboard/databases/${db.id}`}
          className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
        >
          View
        </a>
      </Table.Cell>
    </Table.Row>
  );
};
