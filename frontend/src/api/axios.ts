import axios from "axios";
import { auth } from "../firebase";

const client = axios.create({
  baseURL: "http://127.0.0.1:3000",
  timeout: 30000 ,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

client.interceptors.request.use(
  async (config) => {
    const idToken = await auth.currentUser?.getIdToken();
    if (idToken) {
      config.headers["Authorization"] = `Bearer ${idToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;