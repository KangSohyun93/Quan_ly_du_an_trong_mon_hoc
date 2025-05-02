import React from "react";
import { Routes, Route } from "react-router-dom";
import { KanbanView } from "./components/task/KanbanView";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<KanbanView />} />
      </Routes>
    </div>
  );
}

export default App;