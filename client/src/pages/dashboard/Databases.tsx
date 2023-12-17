import { useEffect, useState } from "react";
import { NavbarComponent } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { rest } from "../../utils/REST";
import { Routes } from "../../utils/Routes";
import { Button, Label, Select, Table, TextInput } from "flowbite-react";
import { Loader } from "../../components/Loader";
import { supportedDBs } from "../../config";

export const Databases = () => {
  const id = location.href.split("/").pop();

  const [data, setData] = useState<any[any] | null>(null);
  const [dests, setDests] = useState<any[any] | null>(null);

  const fetchData = async () => {
    const res = await rest.get(Routes.Databases(id), {});
    if (!res.ok) return rest.error(res);
    setData(res.data);

    const res2 = await rest.get(Routes.Destinations(), {});
    if (!res2.ok) return rest.error(res2);
    setDests(res2.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const res = await rest.put(Routes.Databases(id), data);
    if (!res.ok) return rest.error(res);
    location.reload();
  };

  const handleDelete = async () => {
    const ok = confirm("Are you sure you want to delete this database?");
    if (!ok) return;

    const force = confirm("Do you want to remove all backups from cloud?");

    const res = await rest.delete(Routes.Databases(id), {
      force,
    });

    if (!res.ok) return rest.error(res);
    location.replace("/dashboard");
  };

  useEffect(() => {
    if (!data) fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    const console = document.getElementById("console");
    console?.scrollTo({
      top: console.scrollHeight,
      behavior: "smooth",
    });
  });

  if (!data || !dests) return <Loader />;

  return (
    <>
      <NavbarComponent />
      <main className="flex justify-center mt-10 dark:text-white px-5">
        <div className="w-full md:w-1/2">
          <div className="text-center mb-5">
            Database:
            <br />
            <code className="text-violet-600">{id}</code>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            <div
              id="console"
              className="w-full md:1/2 h-[400px] mt-8 bg-slate-300 dark:bg-slate-600 rounded p-3 overflow-auto"
            >
              {data.logs.map((l: any, i: number) => (
                <>
                  <code key={i}>
                    {new Date(l.date).toLocaleString() + " | " + l.message}
                  </code>
                  <br />
                </>
              ))}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Name" />
                </div>
                <TextInput
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={data.name}
                  placeholder="my cloud"
                  required
                />
              </div>

              <div className="mb-3">
                <div className="mb-2 block">
                  <Label htmlFor="destination" value="Destination" />
                </div>
                <Select
                  id="destination"
                  name="destination"
                  defaultValue={data.destination}
                  required
                >
                  {dests.map((d: any, i: number) => (
                    <option key={i} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="mb-3">
                <div className="mb-2 block">
                  <Label htmlFor="type" value="DB Type" />
                </div>
                <Select id="type" name="type" defaultValue={"mongodb"} required>
                  {supportedDBs.map((d: any, i: number) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="mb-3">
                <div className="mb-2 block">
                  <Label htmlFor="connectionURL" value="Connection URL" />
                </div>
                <TextInput
                  id="connectionURL"
                  name="connectionURL"
                  type="text"
                  defaultValue={data.connectionURL}
                  placeholder="connection url"
                  required
                />
              </div>

              <Button type="submit">Submit</Button>
            </form>
          </div>

          <div className="my-5">
            <BackupTable backups={data.backups} />
          </div>

          <div className="w-full mt-10">
            <Button color="red" onClick={handleDelete}>
              Delete Database
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

const BackupTable = (props: { backups: any[] }) => {
  const id = location.href.split("/").pop();
  const { backups } = props;

  const handlePost = async () => {
    const res = await rest.post(Routes.Backups(), {});

    if (!res.ok) return rest.error(res);

    location.reload();
  };

  const handleDelete = async (bid: string) => {
    const ok = confirm("Are you sure you want to delete this backup?");
    if (!ok) return;

    const res = await rest.delete(Routes.Backups(bid), {
      modelId: id,
    });

    if (!res.ok) return rest.error(res);

    location.reload();
  };

  return (
    <>
      <div className="flex flex-wrap gap-5 justify-between itesm-center mb-3">
        <span>Backups</span>
        <Button color="blue" onClick={handlePost}>
          Perform Backup
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Key</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {backups.map((b: any, i: number) => (
              <Table.Row
                key={i}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>{new Date(b.date).toLocaleString()}</Table.Cell>
                <Table.Cell>{b.dest}</Table.Cell>
                <Table.Cell>
                  <Button color="red" onClick={() => handleDelete(b.id)}>
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};
