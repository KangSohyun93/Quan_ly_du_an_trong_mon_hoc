import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/global.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./components/auth/Register/RegisterForm.js";
import LoginForm from "./components/auth/Login/LoginForm.js";
import SV_TeamClass from "./pages/SV_Teamclass.js";
import SV_TeamDetail from "./pages/SV_TeamDetail.js";
import ProjectInfo from "./components/introduce/ProjectInfo.js";
import KanbanView from "./components/shared/task/KanbanView.js";
import RequireAuth from "./components/auth/RequireAuth.js";
import RequireRole from "./components/auth/RequireRole.js";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
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
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
