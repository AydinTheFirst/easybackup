import axios from "axios";

import { Routes } from "./Routes";
import { toast } from "./toast";
import { API } from "../config";

/**
 * REST module is developed in order to make easier to work with REST API's.
 * This module uses axios for making requests.
 * It is flexible
 */
export class REST {
  baseURL: string;
  token: string;
  methods: IRequestMethods;
  routes: typeof Routes;
  constructor(restConf: IRestConfig) {
    this.baseURL = restConf.baseURL;

    this.token = restConf.token;

    this.methods = {
      Get: "get",
      Delete: "delete",
      Put: "put",
      Post: "post",
    };

    this.routes = Routes;
  }

  makeRequest = async (
    url: string,
    data: object,
    method: string
  ): Promise<IRestResponse> => {
    try {
      const res = await axios({
        baseURL: this.baseURL,
        headers: {
          Authorization: this.token,
        },
        url,
        method,
        data,
      });
      console.log(res);

      return {
        ok: res.status >= 200 && res.status < 300,
        status: res.status,
        data: res.data,
      };
    } catch (error: any) {
      if (!error.response) {
        return {
          ok: false,
          errorMessage: "Conection Errror",
          status: -1,
          error: `Could not connect to: ${this.baseURL}`,
        };
      }

      return {
        ok: false,
        status: error.response.status,
        error: error.response.data,
      };
    }
  };

  async get(path: string, body: object | null) {
    path = path + "?" + this._bodyToQueryParams(body);
    body = {};
    return this.makeRequest(path, body, this.methods.Get);
  }

  async delete(path: string, body: object) {
    return this.makeRequest(path, body, this.methods.Delete);
  }

  async post(path: string, body: object) {
    return this.makeRequest(path, body, this.methods.Post);
  }

  async put(path: string, body: object) {
    return this.makeRequest(path, body, this.methods.Put);
  }

  setToken(token: string) {
    this.token = token;
  }

  _bodyToQueryParams(body: any) {
    const params = new URLSearchParams();

    for (const key in body) {
      // eslint-disable-next-line no-prototype-builtins
      if (body.hasOwnProperty(key)) {
        params.append(key, body[key]);
      }
    }
    return params.toString();
  }

  error(res: any) {
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    console.log(res);
    return toast({
      title: res.errorMessage,
      message: res.error.message || String(res.error),
    });
  }
}

// Export
export const rest = new REST({
  baseURL: API,
  token: localStorage.getItem("token") || "Bearer token",
});

export interface IRestConfig {
  baseURL: string;
  token: string;
}

export interface IRestResponse {
  ok: boolean;
  status: number;
  data?: any;
  errorMessage?: string;
  error?: any;
}

export interface IRequestMethods {
  Get: string;
  Delete: string;
  Put: string;
  Post: string;
}
