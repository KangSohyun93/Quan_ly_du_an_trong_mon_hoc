// components/layout/HomeLayout.js
import React from "react";
// import Sidebar from "../components/shared/Sidebar/Sidebar.js";
import { Outlet } from "react-router-dom";
import UserTable from "../components/user-manager/UserTable.js";

function UserManager() {
  return (
    <div
      className="app-content d-flex"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {/* <div style={{ flexShrink: 0 }}>
        <Sidebar />
      </div> */}

      <div className="flex-grow-1" style={{ overflow: "hidden" }}>
        {/* <Navbar_SV /> */}
        <div
          className="page-content p-3"
          style={{
            flexGrow: 1,
            overflowY: "auto", // Cho phép phần nội dung cuộn
            height: "100%",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserManager;
