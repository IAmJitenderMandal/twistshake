import axios from "axios";

// creating an instance
const instance = axios.create({
  baseURL: "http://twistshake.live/admin/api",
});

export default instance;
