import { Response } from "express";

export const APIError = (res: Response, message: string) => {
  return res.status(400).send({ message });
};

export const formatTime = (timeInMilliseconds: number) => {
  const seconds = Math.floor(timeInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);

  return `${minutes} minutes ${seconds % 60} seconds`;
};
