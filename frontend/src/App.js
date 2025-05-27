import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/global.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./components/auth/Register/RegisterForm.js";
import LoginForm from "./components/auth/Login/LoginForm.js";
import SV_TeamClass from "./pages/SV_Teamclass.js";
import SV_TeamDetail from "./pages/SV_TeamDetail.js";
import ProjectInfo from "./components/introduce/ProjectInfo.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/home" element={<SV_TeamClass />} />
          <Route
            path="/home/classes/:classId/group/:groupId"
            element={<SV_TeamDetail />}
          >
            <Route path="introduce" element={<ProjectInfo />} />
            {/* <Route path="class/join" />
            <Route path="class/:id" />  */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
