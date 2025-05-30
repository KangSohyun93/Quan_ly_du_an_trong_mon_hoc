// components/layout/HomeLayout.js
import React from "react";
import Sidebar from "../components/shared/Sidebar/Sidebar.js";
import { Outlet } from "react-router-dom";
import UserTable from "../components/user-manager/UserTable.js";

function UserManager() {
  return (
    <div className="app-content d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        {/* <Navbar_SV /> */}
        <div className="page-content p-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserManager;
