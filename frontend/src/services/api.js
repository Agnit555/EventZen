import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    const decoded = JSON.parse(atob(token.split(".")[1]));

    req.headers.Authorization = token;
    req.headers.role = decoded.role; //  important
  }

  return req;
});

export default API;