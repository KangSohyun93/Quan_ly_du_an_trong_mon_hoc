import React from "react";
import { Routes, Route } from "react-router-dom";
import { KanbanView } from "./components/task/KanbanView";
// import CreateTask from "./components/task/CreateTask";
// import ProjectManagerKanban from "./components/task/ProjectManagerKanban";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={< KanbanView/>} />
      </Routes>
    </div>
  );
}

export default App;