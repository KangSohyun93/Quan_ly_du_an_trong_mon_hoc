import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/global.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./components/register/RegisterForm.js";
import LoginForm from "./components/auth/LoginForm.js";
import SV_HomeLayout from "./components/SV_HomeLayout/SV_HomeLayout.js";
import ProjectInfo from "./components/introduce/ProjectInfo.js";
import TeamHeader from "./components/TeamHeader/TeamHeader.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/home" element={<SV_HomeLayout />}>
            <Route path="group/:id/introduce" element={<ProjectInfo />} />
            {/* Thêm các route khác ở đây */}
            <Route path="class/join" />
            <Route path="class/:id" />
          </Route>
          {/* Các route khác */}
          <Route path="/header" element={<TeamHeader />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
