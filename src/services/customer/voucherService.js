import { use } from "react";
import api from "../apiClient";

const voucherService = {

  useVoucher: (data) => api.post(`/customer/address`, data),
};

export default voucherService;

