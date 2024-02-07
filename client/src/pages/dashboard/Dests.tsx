import { TableHeader } from "@/components/Table";
import { IDest, useDestinations } from "@/hooks/useDestinations";
import { DashboardLayout } from "@/layouts/Dashboard";
import { Table } from "flowbite-react";

export const Destinations = () => {
  return (
    <DashboardLayout>
      <TableHeader
        label="Destinations"
        url="/dashboard/destinations/create"
        handleSearch={(e) => console.log(e.target.value)}
      />

      <br />

      <DestTable />
    </DashboardLayout>
  );
};

const DestTable = () => {
  const { destinations } = useDestinations();

  if (!destinations) return null;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead />
        <Table.Body className="divide-y">
          {destinations.map((dest, i) => (
            <TableRow key={dest.id} dest={dest} i={i} />
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
      <Table.HeadCell>Destination Name</Table.HeadCell>
      <Table.HeadCell>Bucket</Table.HeadCell>
      <Table.HeadCell>Region</Table.HeadCell>
      <Table.HeadCell>
        <span className="sr-only">Edit</span>
      </Table.HeadCell>
    </Table.Head>
  );
};

const TableRow = ({ dest, i }: { dest: IDest; i: number }) => {
  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell>{i + 1}</Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {dest.name}
      </Table.Cell>
      <Table.Cell>{dest.bucket}</Table.Cell>
      <Table.Cell>{dest.region}</Table.Cell>
      <Table.Cell>
        <a
          href={`/dashboard/destinations/${dest.id}`}
          className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
        >
          View
        </a>
      </Table.Cell>
    </Table.Row>
  );
};
