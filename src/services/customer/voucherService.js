import { use } from "react";
import api from "../apiClient";

const voucherService = {
  getVoucher: () => api.get(`/customer/voucher`),

  checkVoucher: (code) =>
    api.get(`/customer/check-voucher`, {
      params: { code },
    }),
};

export default voucherService;