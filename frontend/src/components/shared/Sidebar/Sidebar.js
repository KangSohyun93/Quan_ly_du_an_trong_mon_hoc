import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";
import worktraceLogo from "../../../assets/images/worktrace-logo.svg";
import worktraceLogoSmall from "../../../assets/images/worktrace-logo-ban-thu-nho.svg";
import avatarDefault from "../../../assets/images/avatar-default.svg";
import { fetchUser } from "../../../services/user-service";

const SIDEBAR_STATE_KEY = "sidebarIsOpenWorktraceApp";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = sessionStorage.getItem(SIDEBAR_STATE_KEY);
    if (savedState !== null) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error("Lỗi parse trạng thái sidebar từ sessionStorage:", e);
        return true;
      }
    }
    return true;
  });

  const [selectedItem, setSelectedItem] = useState(null); // Sẽ được quản lý bởi useEffect dưới đây
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [avatarSrc, setAvatarSrc] = useState(avatarDefault);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUser();
        setUser(data);
        if (data && data.avatar) {
          setAvatarSrc(data.avatar);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  useLayoutEffect(() => {
    if (isOpen) {
      document.body.classList.remove("sidebar-collapsed");
      document.body.classList.add("sidebar-expanded");
    } else {
      document.body.classList.remove("sidebar-expanded");
      document.body.classList.add("sidebar-collapsed");
    }
    try {
      sessionStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(isOpen));
    } catch (e) {
      console.error("Không thể lưu trạng thái sidebar vào sessionStorage", e);
    }
    return () => {
      document.body.classList.remove("sidebar-collapsed", "sidebar-expanded");
    };
  }, [isOpen, location.pathname]);

  // useEffect để tự động cập nhật selectedItem dựa trên role và URL
  useEffect(() => {
    if (!user || !user.role) {
      // Nếu không có user hoặc role, không có item nào active
      // Sử dụng callback để đảm bảo chỉ set nếu giá trị thực sự thay đổi
      setSelectedItem((currentSelectedItem) =>
        currentSelectedItem !== null ? null : currentSelectedItem
      );
      return;
    }

    const currentPath = location.pathname;
    let newActiveItem = null;

    if (user.role === "Student" || user.role === "Instructor") {
      // Nếu URL là của Student/Instructor, "Teams" sẽ là active mặc định.
      // Khi người dùng click "Thông báo", `handleItemClick` sẽ set nó.
      // Khi điều hướng đi, useEffect này sẽ chạy lại và set "Teams" nếu path vẫn là của Student/Instructor.
      if (
        currentPath.startsWith("/home") ||
        currentPath.startsWith("/instructor/home")
      ) {
        newActiveItem = "Teams";
      }
    } else if (user.role === "Admin") {
      if (currentPath.startsWith("/admin/class-manager")) {
        newActiveItem = "Class Manager";
      } else if (currentPath.startsWith("/admin")) {
        // Mặc định cho Admin là "User Manager" cho các trang /admin và con của nó
        newActiveItem = "User Manager";
      }
    }

    // Sử dụng callback form của setSelectedItem để chỉ cập nhật nếu giá trị mới khác giá trị hiện tại,
    // tránh vòng lặp render không cần thiết.
    setSelectedItem((currentSelectedItem) => {
      if (currentSelectedItem !== newActiveItem) {
        return newActiveItem;
      }
      return currentSelectedItem;
    });
  }, [location.pathname, user]); // Chạy lại khi URL hoặc user thay đổi

  const toggleSidebar = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleItemClick = (item, path) => {
    setSelectedItem(item); // Cho phép UI phản hồi ngay khi click
    navigate(path); // Điều hướng, sẽ kích hoạt useEffect ở trên để "sửa" lại active item nếu cần
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem(SIDEBAR_STATE_KEY);
    navigate("/login");
  };

  const renderMenuItems = () => {
    if (!user) return null;

    const commonItemClasses = `sidebar-item flex items-center text-gray-700 rounded`;
    const collapsedItemClasses = !isOpen ? "justify-center p-2" : "p-2";

    const getItemClasses = (item) => {
      return `${commonItemClasses} ${collapsedItemClasses} ${
        selectedItem === item ? "bg-blue-100" : ""
      }`;
    };

    const iconClasses = `icon ${isOpen ? "mr-3" : ""}`;

    if (user.role === "Student" || user.role === "Instructor") {
      return (
        <>
          <a
            href="#"
            className={getItemClasses("Teams")}
            onClick={() =>
              handleItemClick(
                "Teams",
                user.role === "Student" ? "/home" : "/instructor/home" // Path này có thể cần điều chỉnh nếu "Teams" không phải là trang chính
              )
            }
          >
            <i className={`${iconClasses} fa-solid fa-people-group`}></i>
            {isOpen && <p>Teams</p>}
          </a>
          <a
            href="#"
            className={getItemClasses("Thông báo")}
            onClick={() =>
              handleItemClick(
                "Thông báo",
                // Giả sử "Thông báo" điều hướng đến cùng trang chính hoặc một trang cụ thể
                user.role === "Student" ? "/home" : "/instructor/home"
              )
            }
          >
            <i className={`${iconClasses} fa-solid fa-bell`}></i>
            {isOpen && <p>Thông báo</p>}
          </a>
        </>
      );
    } else if (user.role === "Admin") {
      return (
        <>
          <a
            href="#"
            className={getItemClasses("User Manager")}
            onClick={() =>
              handleItemClick("User Manager", "/admin/user-manager")
            }
          >
            <i className={`${iconClasses} fa-solid fa-user-gear`}></i>
            {isOpen && <p>User Manager</p>}
          </a>
          <a
            href="#"
            className={getItemClasses("Class Manager")}
            onClick={() =>
              handleItemClick("Class Manager", "/admin/class-manager")
            }
          >
            <i className={`${iconClasses} fa-solid fa-chalkboard-user`}></i>
            {isOpen && <p>Class Manager</p>}
          </a>
        </>
      );
    }
    return null;
  };

  return (
    <div className="sidebar">
      <div
        className={`bg-white h-screen border-r transition-all ${
          isOpen ? "w-64" : "w-20"
        } overflow-hidden`}
      >
        <div
          className={`sidebar-all h-full flex flex-col ${
            isOpen ? "p-4" : "p-3"
          }`}
        >
          <div className="sidebar-top">
            <div
              className={`flex ${
                isOpen
                  ? "items-center justify-between"
                  : "flex-col items-center space-y-3"
              }`}
            >
              <img
                src={isOpen ? worktraceLogo : worktraceLogoSmall}
                alt="WorkTrace Logo"
                className={`logo ${isOpen ? "h-10" : "w-10 h-10"}`}
              />
              <button onClick={toggleSidebar} className="open_close_sidebar">
                <i
                  className={
                    isOpen ? "fas fa-chevron-left" : "fas fa-chevron-right"
                  }
                ></i>
              </button>
            </div>

            <a
              href="/profile"
              className={`flex items-center mt-6 ${
                isOpen ? "user-ava-name" : "justify-center py-2"
              }`}
              style={!isOpen ? { padding: "0.5rem 0" } : {}}
            >
              <img
                src={avatarSrc}
                alt="User Avatar"
                className={`avatar ${isOpen ? "mr-3" : ""}`}
              />
              {isOpen && (
                <span className="user-name text-gray-700">
                  {user?.username || "Your name"}
                </span>
              )}
            </a>

            {isOpen && <div className="line mt-3 mb-3"></div>}

            <div
              className={`sidebar-content flex-grow ${
                isOpen ? "mt-6" : "mt-3"
              }`}
            >
              {renderMenuItems()}
            </div>
          </div>

          <div
            className={`logout ${isOpen ? "" : "flex justify-center"} mt-auto`}
            onClick={handleLogout}
          >
            <a
              href="#"
              className={`flex items-center text-gray-700 rounded ${
                isOpen ? "p-2" : "p-3"
              }`}
            >
              <i
                className={`icon ${
                  isOpen ? "mr-3" : ""
                } fa-solid fa-right-from-bracket`}
              ></i>
              {isOpen && <p>Log out</p>}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
