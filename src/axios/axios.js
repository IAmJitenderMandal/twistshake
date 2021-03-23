import axios from "axios";

// creating an instance
const instance = axios.create({
  baseURL: "https://twistshake.ae/admin/api",
});

export default instance;
