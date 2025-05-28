import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setShowMessage(true); // hiện thông báo
      setTimeout(() => {
        navigate("/login");
      }, 2000); // đợi 2 giây rồi chuyển hướng
    }
  }, [navigate]);

  if (showMessage) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        Bạn chưa đăng nhập. Đang chuyển hướng...
      </div>
    );
  }

  return children;
};

export default RequireAuth;
