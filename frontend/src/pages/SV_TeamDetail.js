import React, { useEffect, useState } from "react";
import Sidebar from "../components/shared/Sidebar/Sidebar.js";
import TeamHeader from "../components/shared/TeamHeader/TeamHeader.js";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchGroupData } from "../services/group-service.js";
import { Outlet } from "react-router-dom";

function SV_TeamDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { classId, groupId } = useParams();

  // Đọc tab hiện tại từ URL
  const activeTab = location.pathname.split("/").pop();
  // Ép state nếu không có (tránh lỗi khi truy cập trực tiếp không qua ClassCard)
  const [groupData, setGroupData] = useState(null);

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
  if (!groupData) {
    return <div>Đang tải dữ liệu...</div>; // hoặc spinner, loading component
  }

  const { project, group, members } = groupData;
  const handleTabChange = (tab) => {
    const path = tab.toLowerCase().replace(/\s+/g, "-"); // team task -> team-task
    navigate(`/home/classes/${classId}/group/${groupId}/${path}`);
  };
  return (
    <div className="app-content d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <TeamHeader
          className={group.className}
          classCode={group.classId}
          teamName={group.name}
          projectName={project.name}
          members={members}
          activeTab={activeTab} // Hoặc state.activeTab nếu có
          sprints={[]} // Gán mảng rỗng hoặc dữ liệu từ API nếu có
          selectedSprintId={null}
          onSprintChange={() => {}}
          onTabChange={handleTabChange}
        />
        <div className="page-content p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default SV_TeamDetail;
