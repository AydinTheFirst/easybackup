import io from "socket.io-client";
import { API } from ".";
import { toast } from "@/components/Toast";

export const socket = (token: string) => {
  const socket = io(API, {
    query: {
      token,
    },
  });

  socket.on("error", (error: string) => {
    toast({
      description: error,
    });
  });

  return socket;
};
