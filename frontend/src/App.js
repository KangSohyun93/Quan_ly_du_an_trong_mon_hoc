import React from "react";
import { Routes, Route } from "react-router-dom";
import { KanbanView } from "./components/task/KanbanView";
import CreateTask from "./components/task/CreateTask";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<CreateTask />} />
      </Routes>
    </div>
  );
}

export default App;