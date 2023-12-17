import { useEffect, useRef, useState } from "react";

import { NavbarComponent } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Loader } from "../components/Loader";

import { rest } from "../utils/REST";
import { Routes } from "../utils/Routes";

import {
  Button,
  Label,
  Modal,
  Select,
  Spinner,
  Table,
  TextInput,
} from "flowbite-react";
import { supportedDBs } from "../config";

export const Dashboard = () => {
  const [showDBModal, setShowDBModal] = useState<boolean>(false);
  const [showDestModal, setShowDestModal] = useState<boolean>(false);

  const [dests, setDests] = useState<any[] | null>(null);
  const [databases, setDatabases] = useState<any[] | null>(null);

  const fetchData = async () => {
    const res = await rest.get(Routes.Destinations(), {});
    if (!res.ok) return rest.error(res);
    setDests(res.data);

    const res2 = await rest.get(Routes.Databases(), {});
    if (!res2.ok) return rest.error(res2);
    setDatabases(res2.data);
  };

  useEffect(() => {
    if (!dests) fetchData();
  }, [dests]);

  if (!dests || !databases) return <Loader />;

  return (
    <>
      <NavbarComponent />

      <main className="container mx-auto px-5 mt-10 dark:text-white flex justify-center">
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-center gap-3 flex-wrap mb-3">
            <span className="text-xl">Destinations</span>
            <Button
              gradientDuoTone="greenToBlue"
              onClick={() => setShowDestModal(!showDestModal)}
            >
              <i className="fa-solid fa-plus me-2"></i>
              New
            </Button>
          </div>
          <DestTable dests={dests} />

          <hr className="my-10" />

          <div className="flex justify-between items-center gap-3 flex-wrap mb-3">
            <span className="text-xl">Databases</span>
            <Button
              gradientDuoTone="greenToBlue"
              onClick={() => setShowDBModal(!showDBModal)}
            >
              <i className="fa-solid fa-plus me-2"></i>
              New
            </Button>
          </div>
          <DatabaseTable data={databases} />
        </div>
      </main>

      <DbModal
        openModal={showDBModal}
        setOpenModal={setShowDBModal}
        dests={dests}
      />
      <DestModal openModal={showDestModal} setOpenModal={setShowDestModal} />

      <Footer />
    </>
  );
};

const DestTable = (props: { dests: any[] }) => {
  const { dests } = props;

  return (
    <>
      <div className="overflow-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Endpoint</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {dests.map((dest, i) => (
              <Table.Row
                key={i}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {dest.name}
                </Table.Cell>
                <Table.Cell className="blur">{dest.endpoint}</Table.Cell>
                <Table.Cell>
                  <a
                    href={`/dashboard/destinations/${dest.id}`}
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Edit
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

const DatabaseTable = (props: { data: any[] }) => {
  const { data } = props;

  const date = (arr: any[]) => {
    const last = arr[arr.length - 1];
    if (!last) return "Never";
    return new Date(last.date).toLocaleString();
  };

  return (
    <>
      <div className="overflow-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Last Backup</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {data.map((d) => (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {d.name}
                </Table.Cell>
                <Table.Cell>{date(d.backups)}</Table.Cell>
                <Table.Cell>
                  <a
                    href={`/dashboard/databases/${d.id}`}
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Edit
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

const DbModal = (props: {
  openModal: boolean;
  setOpenModal: any;
  dests: any[];
}) => {
  const { openModal, setOpenModal, dests } = props;
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.target as HTMLFormElement);
    const res = await rest.post(Routes.Databases(), data);
    if (!res.ok) {
      setLoading(false);
      return rest.error(res);
    }

    window.location.reload();
  };

  return (
    <Modal
      show={openModal}
      popup
      onClose={() => setOpenModal(false)}
      initialFocus={emailInputRef}
    >
      <Modal.Header className="border-b">Create new database</Modal.Header>
      <Modal.Body>
        <form className="my-6" onSubmit={handleSubmit}>
          <div className="mb-3">
            <div className="mb-2 block">
              <Label htmlFor="name" value="Cloud Name" />
            </div>
            <TextInput
              id="name"
              name="name"
              type="text"
              placeholder="my cloud"
              required
            />
          </div>

          <div className="mb-3">
            <div className="mb-2 block">
              <Label htmlFor="destination" value="Destination" />
            </div>
            <Select id="destination" name="destination" required>
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
            <Select id="type" name="type" required>
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
              placeholder="connection url"
              required
            />
          </div>

          {loading ? (
            <Button>
              <Spinner aria-label="Spinner button example" size="sm" />
              <span className="pl-3">Loading...</span>
            </Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </form>
      </Modal.Body>
    </Modal>
  );
};

const DestModal = (props: { openModal: boolean; setOpenModal: any }) => {
  const { openModal, setOpenModal } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.target as HTMLFormElement);
    const res = await rest.post(Routes.Destinations(), data);

    if (!res.ok) {
      setLoading(false);
      return rest.error(res);
    }

    window.location.reload();
  };

  return (
    <Modal
      show={openModal}
      popup
      onClose={() => setOpenModal(false)}
      initialFocus={emailInputRef}
    >
      <Modal.Header className="border-b">Create new destination</Modal.Header>
      <Modal.Body>
        <form className="my-6" onSubmit={handleSubmit}>
          <div className="mb-3">
            <div className="mb-2 block">
              <Label htmlFor="name" value="Cloud Name" />
            </div>
            <TextInput
              id="name"
              name="name"
              type="text"
              placeholder="my cloud"
              required
            />
          </div>

          <div className="mb-3">
            <div className="mb-2 block">
              <Label htmlFor="accessKeyId" value="Access Key Id" />
            </div>
            <TextInput
              id="accessKeyId"
              name="accessKeyId"
              type="text"
              placeholder="myAccessKey123"
              required
            />
          </div>

          <div className="mb-3">
            <div className="mb-2 block">
              <Label htmlFor="secretAccessKey" value="Access Secret" />
            </div>
            <TextInput
              id="secretAccessKey"
              name="secretAccessKey"
              type="text"
              placeholder="secretAccessKey123"
              required
            />
          </div>

          <div className="mb-3">
            <div className="mb-2 block">
              <Label htmlFor="bucket" value="Bucket" />
            </div>
            <TextInput
              id="bucket"
              name="bucket"
              type="text"
              placeholder="bucket-name"
              required
            />
          </div>

          <div className="mb-3">
            <div className="mb-2 block">
              <Label htmlFor="region" value="Region" />
            </div>
            <TextInput
              id="region"
              name="region"
              type="text"
              placeholder="eu-central"
              required
            />
          </div>

          <div className="mb-3">
            <div className="mb-2 block">
              <Label htmlFor="endpoint  " value="Endpoint" />
            </div>
            <TextInput
              id="endpoint"
              name="endpoint"
              type="text"
              placeholder="https://mys3.aws.com"
              required
            />
          </div>

          {loading ? (
            <Button>
              <Spinner aria-label="Spinner button example" size="sm" />
              <span className="pl-3">Loading...</span>
            </Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </form>
      </Modal.Body>
    </Modal>
  );
};
