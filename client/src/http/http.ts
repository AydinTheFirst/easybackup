import { toast } from "@/components/Toast";
import axios from "axios";

/**
 * REST module is developed in order to make easier to work with REST API's.
 * This module uses axios for making requests.
 * It is flexible
 */
export class REST {
  baseURL: string;
  token: string;
  constructor(restConf: IRestConfig) {
    this.baseURL = restConf.baseURL;
    this.token = restConf.token;
  }

  makeRequest = async (
    url: string,
    data: object,
    method: string,
  ): Promise<any> => {
    // make request
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

      return res.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        return (window.location.href = "/login");
      }

      this.error(error);
      throw new Error("Something went wrong!");
    }
  };

  async get(path: string, body: any) {
    path = path + "?" + this._bodyToQueryParams(body);
    body = {};
    return this.makeRequest(path, body, "GET");
  }

  async delete(path: string, body: any) {
    return this.makeRequest(path, body, "DELETE");
  }

  async post(path: string, body: any) {
    return this.makeRequest(path, body, "POST");
  }

  async put(path: string, body: any) {
    return this.makeRequest(path, body, "PUT");
  }

  async patch(path: string, body: any) {
    return this.makeRequest(path, body, "PATCH");
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

  error(error: any) {
    let errorMessage = "Something went wrong";

    if (error.response && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    toast({
      title: "Error",
      message: errorMessage,
    });
  }
}

export interface IRestConfig {
  baseURL: string;
  token: string;
}
