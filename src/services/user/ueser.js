import api from "../apiClient";

export const createAccount = (data) => {
  return api.post("v1/users", data);
};