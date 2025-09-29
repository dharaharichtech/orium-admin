import axios from "axios";

const NEXT_PUBLIC_API_BASE_URL = "https://demo.harichtech.com/api"

const baseApi = axios.create({
  baseURL: NEXT_PUBLIC_API_BASE_URL, 
  headers: {
    "Content-Type": "application/json",
  },
   maxRedirects: 0, 
});

export default baseApi;
