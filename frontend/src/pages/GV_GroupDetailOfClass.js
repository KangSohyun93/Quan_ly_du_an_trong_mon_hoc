import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/shared/Sidebar/Sidebar.js";
import TeamHeader from "../components/shared/TeamHeader/TeamHeader.js";
import { useLocation, useNavigate, useParams, Outlet } from "react-router-dom";
import { fetchGroupData } from "../services/group-service.js";

function GV_GroupDetailOfClass({ currentUserId }) {
  currentUserId = currentUserId || JSON.parse(localStorage.getItem("user"))?.id;
  const role = JSON.parse(localStorage.getItem("user"))?.role || "student";

  const navigate = useNavigate();
  const location = useLocation();
  const { classId, groupId } = useParams();

  const activeTab = location.pathname.split("/").pop();
  const [groupData, setGroupData] = useState(null);

  const [sprints, setSprints] = useState([]);
  const [selectedSprintId, setSelectedSprintId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Load group data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetchGroupData({ classId, groupId });
        setGroupData(res);
      } catch (err) {
        console.error(err);
      }
    }
    if (classId && groupId) fetchData();
  }, [classId, groupId]);

  useEffect(() => {
    if (activeTab === "team-task") {
      setSelectedUserId(null); // Reset khi chuyển sang team-task
    } else {
      if (activeTab === "my-task" && selectedUserId !== null) {
        setSelectedUserId(null);
      }
    }
  }, [activeTab]);

  if (!groupData) {
    return <div>Đang tải dữ liệu...</div>;
  }

  const { project, group, members } = groupData;

  const isTeamLead = members.some(
    (m) => m.user_id === currentUserId && m.role === "team-lead"
  );

  const handleTabChange = (tab) => {
    const path = tab.toLowerCase().replace(/\s+/g, "-");
    navigate(`/instructor/home/classes/${classId}/group/${groupId}/${path}`);
  };

  return (
    <div
      className="app-content d-flex"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <div style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ overflow: "hidden" }}
      >
        <TeamHeader
          role={role}
          className={group.className}
          classCode={group.classId}
          teamName={group.name}
          projectName={project.name}
          projectId={project.id}
          members={members}
          activeTab={activeTab}
          sprints={sprints}
          selectedSprintId={selectedSprintId}
          selectedUserId={selectedUserId}
          onSprintChange={setSelectedSprintId}
          onTabChange={handleTabChange}
          onUserChange={setSelectedUserId} // thêm nếu cần user filter
        />
        <div
          className="page-content p-4"
          style={{
            flexGrow: 2,
            overflowY: "auto", // Cho phép phần nội dung cuộn
            height: "100%",
          }}
        >
          <Outlet
            context={{
              activeTab: activeTab,
              members,
              isTeamLead,
              currentUserId, // 👈 cái này thay cho userId
              projectId: project.id,
              groupId: group.id,
              selectedSprintId,
              selectedUserId,
              projectData: project,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default GV_GroupDetailOfClass;
