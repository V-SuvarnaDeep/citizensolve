const API_URL =
  process.env.NODE_ENV === "production"
    ? "/api"
    : "http://127.0.0.1:8000";

export default API_URL;