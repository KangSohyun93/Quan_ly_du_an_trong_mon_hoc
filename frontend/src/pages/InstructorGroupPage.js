import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/SideBar/Sidebar';
import InstructorClassCard from '../components/shared/InstructorClassCard/InstructorClassCard';
import { fetchGroupsByInstructorId } from '../services/instructorGroupService';
import './css/GroupPage.css';
import CreateClassPopup from '../components/shared/CreateClassPopup/CreateClassPopup';

const InstructorGroupPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (!userId || isNaN(userId)) {
        throw new Error('userId không hợp lệ');
      }
      const data = await fetchGroupsByInstructorId(userId);
      console.log('Dữ liệu nhóm từ API:', data);
      const enhancedGroups = data.map((group, index) => ({
        ...group,
        semester: group.semester || 'Chưa xác định',
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

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleClassCardClick = (classId, projectId) => {
    if (!classId || !projectId) {
      console.error('classId hoặc projectId không hợp lệ');
      return;
    }
    navigate(`/userID/${userId}/classes/${classId}/projects/${projectId}/introduce`);
  };

  const handleCreateClass = (newClassData) => {
    const newGroup = {
      classId: newClassData.classId,
      className: newClassData.className,
      semester: newClassData.semester,
      groupCount: 0,
      studentCount: 0,
      avatar: '/uploads/default.jpg',
      avatarNumber: groups.length + 1,
      members: [],
    };
    setGroups(prevGroups => [...prevGroups, newGroup]);
    loadData();
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
          <button className="grouppage-join-class-btn" onClick={() => setShowPopup(true)}>
            Create Class
          </button>
        </div>
        <div className="grouppage-class-card-grid">
          {loading ? (
            <p>Đang tải...</p>
          ) : groups.length > 0 ? (
            groups.map((group, index) => (
              <InstructorClassCard
                key={index}
                classId={group.classId}
                className={group.className}
                groupCount={group.groupCount}
                studentCount={group.studentCount}
                semester={group.semester}
                projectId={group.projectId}
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
      {showPopup && (
        <CreateClassPopup
          onClose={() => setShowPopup(false)}
          onCreate={handleCreateClass}
          instructorId={userId}
        />
      )}
    </div>
  );
};

export default InstructorGroupPage;