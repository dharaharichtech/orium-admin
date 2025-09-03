import axios from "axios";

const baseApi = axios.create({
  baseURL: "http://localhost:5000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default baseApi;
