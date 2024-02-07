import { toast } from "@/components/Toast";
import { useDestination } from "@/hooks/useDestinations";
import { Routes, http } from "@/http";
import { DashboardLayout } from "@/layouts/Dashboard";
import { Button, Label, TextInput } from "flowbite-react";
import { FaAws, FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";

export const ViewDest = () => {
  const destId = useParams<{ id: string }>().id;
  const { destination } = useDestination(destId!);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    destination ? update(form) : create(form);
  };

  const create = async (data: FormData) => {
    try {
      await http.post(Routes.Destinations(), data);
      toast({
        title: "Destination Created",
        message: "Destination has been created successfully",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const update = async (data: FormData) => {
    try {
      await http.put(Routes.Destinations(destId), data);
      toast({
        title: "Destination Updated",
        message: "Destination has been updated successfully",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="container">
        <form action="" className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <Label className="mb-2 block">Destination Name</Label>
            <TextInput
              name="name"
              placeholder="Destination Name"
              sizing={"sm"}
              defaultValue={destination?.name}
              required
            />
          </div>

          <div className="col-md-6">
            <Label className="mb-2 block">Access Key Id</Label>
            <TextInput
              name="accessKeyId"
              placeholder="Access Key Id"
              sizing={"sm"}
              defaultValue={destination?.accessKeyId}
              required
            />
          </div>

          <div className="col-md-6">
            <Label className="mb-2 block">Secret Access Key</Label>
            <TextInput
              name="secretAccessKey"
              placeholder="Secret Access Key"
              sizing={"sm"}
              defaultValue={destination?.secretAccessKey}
              required
            />
          </div>

          <div className="col-md-6">
            <Label className="mb-2 block">Region</Label>
            <TextInput
              name="region"
              placeholder="Region"
              sizing={"sm"}
              defaultValue={destination?.region}
              required
            />
          </div>

          <div className="col-md-6">
            <Label className="mb-2 block">Bucket</Label>
            <TextInput
              name="bucket"
              placeholder="Bucket"
              sizing={"sm"}
              defaultValue={destination?.bucket}
              required
            />
          </div>

          <div className="col-md-6">
            <Label className="mb-2 block">Endpoint</Label>
            <TextInput
              name="endpoint"
              placeholder="Endpoint"
              sizing={"sm"}
              defaultValue={destination?.endpoint}
              required
            />
          </div>

          <div className="col-12">
            {destination ? (
              <Button type="submit" color="green" size={"sm"}>
                <FaSave className="me-2" />
                Save
              </Button>
            ) : (
              <Button type="submit" color="blue" size={"sm"}>
                <FaAws className="me-2" />
                Create
              </Button>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
