import { http } from "@/http";
import { useEffect, useState } from "react";

export const useDestinations = () => {
  const [destinations, setDestinations] = useState<IDest[]>([]);

  const fetch = async () => {
    try {
      const data = await http.get("/destinations", null);

      setDestinations(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { destinations, fetch };
};

export const useDestination = (id: string) => {
  const [destination, setDestination] = useState<IDest>();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await http.get(`/destinations/${id}`, null);

        setDestination(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetch();
  }, [id]);

  return { destination, fetch };
};

export interface IDest {
  id: string;
  ownerId: string;
  name: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  region: string;
  endpoint: string;
}
