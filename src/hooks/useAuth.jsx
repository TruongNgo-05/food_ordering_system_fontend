//Mục đích của nó là lấy dữ liệu từ AuthContext dễ dàng hơn.
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
export const useAuth = () => {
  return useContext(AuthContext);
};