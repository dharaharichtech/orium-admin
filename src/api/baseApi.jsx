import axios from "axios";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://demo.orium.api.harichtech.com/api"

const baseApi = axios.create({
  baseURL: NEXT_PUBLIC_API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
   maxRedirects: 0, 
});

export default baseApi;
