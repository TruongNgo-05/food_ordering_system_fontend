import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { toast } from "react-toastify";

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginGoogle } = useAuth();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const isNew = params.get("new") === "true";
    const handleLogin = async () => {
      if (!accessToken) return;

      await loginGoogle(accessToken);

      setTimeout(() => {
        toast.success(isNew ? "Đăng ký thành công!" : "Đăng nhập thành công!");
        navigate("/customer", { replace: true });
      }, 100);
    };
    handleLogin();
  }, []);

  return <h3>Đang đăng nhập...</h3>;
};

export default OAuthSuccess;
