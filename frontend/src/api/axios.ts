import axios from "axios";

const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 30000 ,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

export default client;