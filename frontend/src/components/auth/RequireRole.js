import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RequireRole = ({ role, children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== role) {
      setTimeout(() => {
        navigate("/login");
      }, 3000); // chuyển sau 3 giây
    }
  }, [user, role, navigate]);

  if (!user || user.role !== role) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <h2>403 - Không có quyền truy cập</h2>
        <p>Bạn sẽ được chuyển hướng về trang đăng nhập sau vài giây...</p>
      </div>
    );
  }

  return children;
};

export default RequireRole;
