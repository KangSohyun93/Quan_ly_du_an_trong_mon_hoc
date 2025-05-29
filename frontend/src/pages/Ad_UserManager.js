// components/layout/HomeLayout.js
import React from "react";
import Sidebar from "../components/shared/Sidebar/Sidebar.js";
import JoinClassBar from "../components/classHeader/classHeader.js";
import { Outlet } from "react-router-dom";
import ImportHeader from "../components/import/import.js";

function UserManager() {
  return (
    <div className="app-content d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        {/* <Navbar_SV /> */}
        <JoinClassBar />
        <ImportHeader />
        <div className="page-content p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserManager;
