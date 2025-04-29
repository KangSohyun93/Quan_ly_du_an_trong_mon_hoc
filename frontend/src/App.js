/* frontend/src/App.js */
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GroupPage from './pages/GroupPage';
import InstructorGroupPage from './pages/InstructorGroupPage';
import Project from './pages/Project';
import ClassGroupPage from './pages/ClassGroupPage'; // File mới

const router = createBrowserRouter(
  [
    { path: '/groups/:userId', element: <GroupPage /> },
    { path: '/groups/:userId/class/:classId', element: <ClassGroupPage /> },
    { path: '/instructor-groups/:id', element: <InstructorGroupPage /> },
    { path: "/projects/:projectId", element: <Project />},
    {
      path: '/',
      element: (
        <div>
          Chào mừng đến với ứng dụng! <a href="/groups/1">Đi đến Nhóm 1</a>
          <div><a href="/instructor-groups/31">Đi đến Nhóm của Giảng viên 1</a></div>
        </div>
      ),
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;