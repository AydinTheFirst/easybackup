import { http } from "@/http";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<IUser>();

  const fetchUser = async () => {
    try {
      const data = await http.get("/auth/@me", null);

      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, setUser, fetchUser };
};

interface IUser {
  id: string;
  email: string;
  displayName: string;
  usernanme: string;
}
