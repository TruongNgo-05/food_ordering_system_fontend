import { use } from "react";
import api from "../apiClient";

const voucherService = {
  getVoucher: () => api.get(`/customer/voucher`),
  checkVoucher: (code) => api.post(`/customer/check?code=${code}`),
  useVoucher: (code) => api.post(`/customer/voucher/apply?code=${code}`),
};

export default voucherService;
