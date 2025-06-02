import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";
import worktraceLogo from "../../../assets/images/worktrace-logo.svg";
import avatarDefault from "../../../assets/images/avatar-default.svg";
import { fetchUser } from "../../../services/user-service";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [avatarSrc, setAvatarSrc] = useState(avatarDefault);

  useEffect(() => {
    try {
      const user = fetchUser();
      user.then((data) => {
        setUser(data);
        if (data & data.avatar) {
          setAvatarSrc(data.avatar);
        }
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);
  //console.log("User:", user);

  useEffect(() => {
    // Thêm/xóa class trên body để main content có thể dựa vào đó
    if (isOpen) {
      document.body.classList.remove("sidebar-collapsed");
      document.body.classList.add("sidebar-expanded");
    } else {
      document.body.classList.remove("sidebar-expanded");
      document.body.classList.add("sidebar-collapsed");
    }
    // Cleanup function để xóa class khi component unmount
    return () => {
      document.body.classList.remove("sidebar-collapsed");
      document.body.classList.remove("sidebar-expanded");
    };
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item, path) => {
    setSelectedItem(item);
    navigate(path);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    document.body.classList.remove("sidebar-collapsed");
    document.body.classList.remove("sidebar-expanded");
    navigate("/login");
  };

  const renderMenuItems = () => {
    if (!user) return null;

    if (user.role === "Student" || user.role === "Instructor") {
      return (
        <>
          <a
            href="#"
            className={`sidebar-item flex items-center p-2 text-gray-700 rounded ${
              selectedItem === "Teams" ? "bg-blue-100" : ""
            }`}
            onClick={() =>
              handleItemClick(
                "Teams",
                user.role === "Student" ? "/home" : "/instructor/home"
              )
            }
          >
            <i className="icon mr-3 fa-solid fa-people-group"></i>
            <p>Teams</p>
          </a>
          <a
            href="#"
            className={`sidebar-item flex items-center p-2 text-gray-700 rounded ${
              selectedItem === "Thông báo" ? "bg-blue-100" : ""
            }`}
            onClick={() =>
              handleItemClick(
                "Thông báo",
                user.role === "Student" ? "/home" : "/instructor/home"
              )
            }
          >
            <i className="icon mr-3 fa-solid fa-bell"></i>
            <p>Thông báo</p>
          </a>
        </>
      );
    } else if (user.role === "Admin") {
      return (
        <>
          <a
            href="#"
            className={`sidebar-item flex items-center p-2 text-gray-700 rounded ${
              selectedItem === "User Manager" ? "bg-blue-100" : ""
            }`}
            onClick={() =>
              handleItemClick("User Manager", "/admin/user-manager")
            }
          >
            <i className="icon mr-3 fa-solid fa-user-gear"></i>
            <p>User Manager</p>
          </a>
          <a
            href="#"
            className={`sidebar-item flex items-center p-2 text-gray-700 rounded ${
              selectedItem === "Class Manager" ? "bg-blue-100" : ""
            }`}
            onClick={() =>
              handleItemClick("Class Manager", "/admin/class-manager")
            }
          >
            <i className="icon mr-3 fa-solid fa-chalkboard-user"></i>
            <p>Class Manager</p>
          </a>
        </>
      );
    }
  };

  return (
    <div className="sidebar flex">
      <div
        className={`bg-white h-screen border-r transition-all ${
          isOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <img src={worktraceLogo} alt="WorkTrace Logo" className="logo" />
            <button onClick={toggleSidebar} className="open_close_sidebar">
              <i
                className={
                  isOpen ? "fas fa-chevron-left" : "fas fa-chevron-right"
                }
              ></i>
            </button>
          </div>

          {/* User Info */}
          <a className="user-ava-name flex items-center mt-6">
            <img src={avatarSrc} alt="User Avatar" className="avatar mr-3" />
            <span className="user-name text-gray-700">
              {user?.username || "Your name"}
            </span>
          </a>

          <div className="line"></div>

          {/* Menu Items */}
          <div className="sidebar-content mt-6">{renderMenuItems()}</div>

          {/* Logout */}
          {isOpen && (
            <div
              className="logout absolute bottom-4 left-4"
              onClick={handleLogout}
            >
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 rounded"
              >
                <i className="icon mr-3 fa-solid fa-right-from-bracket"></i>
                <p>Log out</p>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="open_close_sidebar fixed top-4 left-4 z-10"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      )}
    </div>
  );
};

export default Sidebar;