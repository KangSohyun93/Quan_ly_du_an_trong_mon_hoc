import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/SideBar/Sidebar';
import TeamHeader from '../components/shared/TeamHeader/TeamHeader';
import { fetchProjectById } from '../services/groupService';
import './css/Project.css';

const Project = () => {
  const { userId, classId, projectId, sprintId, tab } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (!projectId || isNaN(projectId)) {
          throw new Error('projectId không hợp lệ');
        }
        const project = await fetchProjectById(projectId);
        if (!project || !project.project_id) {
          throw new Error('Không tìm thấy dự án');
        }
        setProjectData(project);

        // Nếu không có sprintId và tab trong URL, chọn sprint đang hoạt động hoặc sprint cuối cùng
        if (!sprintId && !tab) {
          if (project.sprints && project.sprints.length > 0) {
            const currentDate = new Date();
            // Tìm sprint đang hoạt động (startDate <= currentDate <= endDate)
            const activeSprint = project.sprints.find((sprint) => {
              const startDate = new Date(sprint.startDate);
              const endDate = new Date(sprint.endDate);
              return startDate <= currentDate && currentDate <= endDate;
            });

            // Nếu không có sprint đang hoạt động, chọn sprint cuối cùng
            const selectedSprint = activeSprint || project.sprints[project.sprints.length - 1];
            navigate(
              `/userID/${userId}/classes/${classId}/projects/${projectId}/sprints/${selectedSprint.sprint_id}/team-task`,
              { replace: true }
            );
          } else {
            // Nếu không có sprint, chuyển đến tab "Introduce" mà không có sprintId
            navigate(`/userID/${userId}/classes/${classId}/projects/${projectId}/introduce`, { replace: true });
          }
        }
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('Error in loadData:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [projectId, userId, classId, navigate, sprintId, tab]);

  const handleSprintChange = (sprint) => {
    // Khi thay đổi sprint, giữ tab hiện tại và cập nhật URL
    const currentTab = activeTab.toLowerCase().replace(' ', '-');
    navigate(`/userID/${userId}/classes/${classId}/projects/${projectId}/sprints/${sprint.sprint_id}/${currentTab}`);
  };

  const handleTabChange = (tabName) => {
    const tabPath = tabName.toLowerCase().replace(' ', '-');
    // Đảm bảo sprintId luôn có trong URL nếu có sprint, nếu không thì không thêm sprintId
    let selectedSprintId = sprintId;
    if (!selectedSprintId && projectData?.sprints?.length > 0) {
      const currentDate = new Date();
      const activeSprint = projectData.sprints.find((sprint) => {
        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);
        return startDate <= currentDate && currentDate <= endDate;
      });
      selectedSprintId = (activeSprint || projectData.sprints[projectData.sprints.length - 1]).sprint_id;
    }

    // Nếu có sprintId, thêm vào URL, nếu không thì không thêm
    if (selectedSprintId) {
      navigate(`/userID/${userId}/classes/${classId}/projects/${projectId}/${tabPath}`);

    } else {
      navigate(`/userID/${userId}/classes/${classId}/projects/${projectId}/sprints/${selectedSprintId}/${tabPath}`);
    }
  };

  const activeTab = tab?.replace('-', ' ') || (sprintId ? 'Team task' : 'Introduce');

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (loading || !projectData) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="project-project-page">
      <Sidebar userId={userId} />
      <div className="project-content-container">
        <TeamHeader
          className={projectData.class_name || 'Tên lớp'}
          classCode={projectData.class_code || '100001'}
          teamName={projectData.group_name || 'Tên nhóm'}
          projectName={projectData.project_name || 'Tên dự án'}
          members={projectData.members || []}
          activeTab={activeTab}
          sprints={projectData.sprints || []}
          selectedSprintId={sprintId}
          onSprintChange={handleSprintChange}
          onTabChange={handleTabChange}
        />
        <div className="project-project-content">
          <p>Tab hiện tại: {activeTab}</p>
          {sprintId && <p>Sprint hiện tại: {sprintId}</p>}
        </div>
      </div>
    </div>
  );
};

export default Project;