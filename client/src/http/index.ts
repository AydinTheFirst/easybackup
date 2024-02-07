import { REST } from "./http";

export const API = import.meta.env.PROD ? "/api" : "http://localhost:3000/api";
console.log(API);

export const http = new REST({
  baseURL: API,
  token: localStorage.getItem("token") || "",
});

export { Routes } from "./routes";

//export { socket } from "./socket";
