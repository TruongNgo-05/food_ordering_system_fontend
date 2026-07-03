import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { toast } from "react-toastify";

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginGoogle } = useAuth();

  useEffect(() => {
    const token = params.get("token");
    const isNew = params.get("new") === "true";

    if (token) {
      loginGoogle(token).then(() => {
        if (isNew) {
          toast.success("Đăng ký tài khoản thành công!");
        } else {
          toast.success("Đăng nhập thành công!");
        }

        navigate("/customer", { replace: true });
      });
    }
  }, []);

  return <h3>Đang đăng nhập...</h3>;
};

export default OAuthSuccess;
