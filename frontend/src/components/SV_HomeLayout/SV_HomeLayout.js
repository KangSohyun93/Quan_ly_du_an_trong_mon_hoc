// components/layout/HomeLayout.js
import React from "react";
import Sidebar from "../slidebar/Sidebar.js";
import Navbar_SV from "../Navbar_SV/Navbar_SV.js";
import { Outlet } from "react-router-dom";
import JoinClassBar from "../classHeader/classHeader.js";

function SV_HomeLayout() {
  return (
    <div className="app-content d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        {/* <Navbar_SV /> */}
        <JoinClassBar />
        <div className="page-content p-4">{/* <Outlet /> */}</div>
      </div>
    </div>
  );
}

export default SV_HomeLayout;
