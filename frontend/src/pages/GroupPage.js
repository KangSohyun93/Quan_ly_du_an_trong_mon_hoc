import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/SideBar/Sidebar';
import ClassCard from '../components/shared/ClassCard/ClassCard';
import { fetchGroupsByUserId } from '../services/groupService';
import './css/GroupPage.css';

const GroupPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (!userId || isNaN(userId)) {
          throw new Error('userId không hợp lệ');
        }
        const data = await fetchGroupsByUserId(userId);
        const enhancedGroups = data.map((group, index) => ({
          ...group,
          avatarNumber: index + 1,
        }));
        setGroups(enhancedGroups);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('Error in loadData:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  const handleClassCardClick = (classId, projectId) => {
    if (!classId || !projectId) {
      console.error('classId hoặc projectId không hợp lệ');
      return;
    }
    navigate(`/userID/${userId}/classes/${classId}/projects/${projectId}/introduce`);
  };

  if (error) {
    return <div className="grouppage-error-message">{error}</div>;
  }

  return (
    <div className="grouppage-group-page">
      <Sidebar userId={userId} />
      <div className="grouppage-content-container">
        <div className="grouppage-page-header">
          <h1 className="grouppage-page-title">Classes</h1>
          <div className="grouppage-search-bar">
            <input type="text" placeholder="Search for classes..." />
          </div>
          <button className="grouppage-join-class-btn">Join Class</button>
        </div>
        <div className="grouppage-class-card-grid">
          {loading ? (
            <p>Đang tải...</p>
          ) : groups.length > 0 ? (
            groups.map((group, index) => (
              <ClassCard
                key={index}
                classId={group.classId}
                className={group.className}
                groupName={group.group_name}
                projectName={group.projectName}
                projectId={group.projectId}
                memberCount={group.memberCount}
                avatar={group.avatar || '/uploads/default.jpg'}
                avatarNumber={group.avatarNumber}
                avatarColor={group.avatarColor || `hsl(${(index * 137.508) % 360}, 70%, 60%)`}
                members={group.members}
                onClick={() => handleClassCardClick(group.classId, group.projectId)}
              />
            ))
          ) : (
            <p>Không có nhóm nào để hiển thị.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupPage;