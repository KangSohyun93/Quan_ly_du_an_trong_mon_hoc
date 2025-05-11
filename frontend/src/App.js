import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GroupPage from './pages/GroupPage';
import Project from './pages/Project';
import ProjectRate from './pages/ProjectRate';
import './assets/styles/global.css';
import Profile from './pages/Profile';
import InstructorGroupPage from './pages/InstructorGroupPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/userID/:userId" element={<GroupPage />} />
        <Route path="/userID/:userId/instructor" element={<InstructorGroupPage />} />
        <Route path="/userID/:userId/classes/:classId/projects/:projectId/:tab" element={<Project />} />
        <Route path="/userID/:userId/classes/:classId/projects/:projectId/sprints/:sprintId" element={<Project />} />
        <Route path="/userID/:userId/classes/:classId/projects/:projectId/rate" element={<ProjectRate />} />
        <Route path="/userID/:userId/profile" element={<Profile />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;