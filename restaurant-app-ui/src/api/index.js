import axios from "axios";

// api use https and port 44394
// const BASE_URL = "https://localhost:44394/api/";
const BASE_URL = "https://localhost:5001/api/";
export const ENDPOINTS = {
  CUSTOMER: "Customer",
  FOODITEM: "FoodItem",
  ORDER: "Order",
};

export const createAPIEndpoint = (endpoint) => {
  // endpoint is name of controller
  let url = BASE_URL + endpoint + "/";
  return {
    fetchAll: () => axios.get(url),
    fetchById: (id) => axios.get(url + id),
    create: (newRecord) => axios.post(url, newRecord),
    update: (id, updatedRecord) => axios.put(url + id, updatedRecord),
    delete: (id) => axios.delete(url + id),
  };
};
