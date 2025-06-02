import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/global.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Profile from "./pages/Profile/Profile.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/profile" element={<Profile />} />
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
          </Route>
          <Route
            path="*"
            element={<div>404 Page Not Found - Main Level</div>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
