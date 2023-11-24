import axios from "axios";

const api = axios.create({
  baseURL: "http://42.96.44.151:3210",
  // any other default settings
});

export const fetchList = async (params) => {
  try {
    // Construct query string from params object
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/?${queryString}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const delLog = async (id) => {
  try {
    // Construct query string from params object

    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default api;
