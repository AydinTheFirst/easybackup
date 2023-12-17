import { useEffect, useState } from "react";
import { NavbarComponent } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { rest } from "../../utils/REST";
import { Routes } from "../../utils/Routes";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { Loader } from "../../components/Loader";

export const Destinations = () => {
  const id = location.href.split("/").pop();

  const [data, setData] = useState<any[any] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    const res = await rest.get(Routes.Destinations(id), {});

    if (!res.ok) return rest.error(res);

    setData(res.data);
  };

  useEffect(() => {
    if (!data) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.target as HTMLFormElement);

    const res = await rest.put(Routes.Destinations(id), data);

    if (!res.ok) {
      setLoading(false);
      return rest.error(res);
    }

    window.location.reload();
  };

  const handleDelete = async () => {
    const ok = confirm("Are you sure you want to delete this destination?");
    if (!ok) return;

    const res = await rest.delete(Routes.Destinations(id), {});

    if (!res.ok) return rest.error(res);

    window.location.replace("/dashboard");
  };

  if (!data) return <Loader />;

  return (
    <>
      <NavbarComponent />
      <main className="flex justify-center mt-10 dark:text-white px-5">
        <div className="w-full md:w-1/2">
          <div className="text-center mb-5">
            Destination:
            <br />
            <code className="text-violet-600">{id}</code>
          </div>
          <div className="flex justify-center">
            <form
              className="w-full md:w-1/2 flex flex-col"
              onSubmit={handleSubmit}
            >
              <div className="mb-3">
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Cloud Name" />
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
                  <Label htmlFor="accessKeyId" value="Access Key Id" />
                </div>
                <TextInput
                  id="accessKeyId"
                  name="accessKeyId"
                  type="text"
                  defaultValue={data.accessKeyId}
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
                  defaultValue={data.secretAccessKey}
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
                  defaultValue={data.bucket}
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
                  defaultValue={data.region}
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
                  defaultValue={data.endpoint}
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
          </div>
          <div className="flex justify-end mt-10">
            <Button color="red" onClick={handleDelete}>
              Delete Destination
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
