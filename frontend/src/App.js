import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/global.css";
import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Sidebar from "./components/shared/Sidebar/Sidebar";

import RegisterForm from "./components/auth/Register/RegisterForm.js";
import LoginForm from "./components/auth/Login/LoginForm.js";
import ProjectInfo from "./components/introduce/ProjectInfo.js";
import KanbanView from "./components/shared/task/KanbanView.js";
import RequireAuth from "./components/auth/RequireAuth.js";
import RequireRole from "./components/auth/RequireRole.js";
import ProjectRate from "./components/shared/Rate/ProjectRate.js";
import UserManagerPage from "./components/user-manager/UserManagerPage.js";
import ClassManagerPage from "./components/class-manager/ClassManagerPage.js";
import EditUserPage from "./components/user-manager/EditUserPage.js";
import AddUserPage from "./components/user-manager/AddUserPage.js";
import UserManager from "./pages/Ad_UserManager.js";
import SV_TeamClass from "./pages/SV_Teamclass.js";
import SV_TeamDetail from "./pages/SV_TeamDetail.js";
import GV_TeamClass from "./pages/GV_Teamclass.js";
import ClassGroupsPage from "./components/classInfo/ClassGroupPage.js";
import ClassMembersPage from "./components/classInfo/ClassMembersPage.js";
import GV_GroupDetailOfClass from "./pages/GV_GroupDetailOfClass.js";
import Dashboard from "./components/dashboard/Dashboard.js";
import Profile from "./components/profile/Profile.js";
import InstructorProjectRate from "./components/shared/Rate/InstructorProjectRate.js"; // Thêm mới

const LayoutWithSidebar = () => {
  return (
    // Thêm class "layout-with-sidebar" cho div bao ngoài
    <div className="layout-with-sidebar" style={{ minHeight: "100vh" }}>
      <Sidebar />
      {/* Thêm class "main-content-area" cho thẻ main */}
      <main
        className="main-content-area"
        style={{ overflowY: "auto", padding: "0px" }}
      >
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Routes không có Sidebar */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          {/* Routes có Sidebar */}
          <Route element={<LayoutWithSidebar />}>
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <RequireRole role="Admin">
                    <UserManager />
                  </RequireRole>
                </RequireAuth>
              }
            >
              <Route path="user-manager" element={<UserManagerPage />} />
              <Route
                path="user-manager/edit/:userId"
                element={<EditUserPage />}
              />
              <Route path="user-manager/add" element={<AddUserPage />} />
              <Route path="class-manager" element={<ClassManagerPage />} />
            </Route>

            <Route
              path="/home"
              element={
                <RequireAuth>
                  <RequireRole role="Student">
                    <SV_TeamClass />
                  </RequireRole>
                </RequireAuth>
              }
            />
            <Route
              path="/instructor/home"
              element={
                <RequireAuth>
                  <RequireRole role="Instructor">
                    <GV_TeamClass />
                  </RequireRole>
                </RequireAuth>
              }
            />
            <Route
              path="/home/classes/:classId/group/:groupId"
              element={
                <RequireAuth>
                  <RequireRole role="Student">
                    <SV_TeamDetail />
                  </RequireRole>
                </RequireAuth>
              }
            >
              <Route path="introduce" element={<ProjectInfo />} />
              <Route path="team-task" element={<KanbanView />} />
              <Route path="my-task" element={<KanbanView />} />
              <Route path="rate" element={<ProjectRate />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>

            <Route
              path="/instructor/home/classes/:classId"
              element={<ClassGroupsPage />}
            />
            <Route
              path="/instructor/home/classes/:classId/members"
              element={<ClassMembersPage />}
            />
            <Route
              path="/instructor/home/classes/:classId/group/:groupId"
              element={
                <RequireAuth>
                  <RequireRole role="Instructor">
                    <GV_GroupDetailOfClass />
                  </RequireRole>
                </RequireAuth>
              }
            >
              <Route path="introduce" element={<ProjectInfo />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="rate" element={<InstructorProjectRate />} />

            </Route>

            <Route
              path="*"
              element={<div>404 Page Not Found - Main Level</div>}
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
