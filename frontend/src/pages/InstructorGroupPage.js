import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/SideBar/Sidebar';
import InstructorClassCard from '../components/shared/InstructorClassCard/InstructorClassCard';
import { fetchGroupsByInstructorId, fetchClassById } from '../services/instructorGroupService';
import './css/GroupPage.css';
import CreateClassPopup from '../components/shared/CreateClassPopup/CreateClassPopup';
import InstructorClassCardMenu from '../components/shared/ClassCardMenu/InstructorClassCardMenu';
import EditClassPopup from '../components/shared/EditClassPopup/EditClassPopup';

const InstructorGroupPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [editClassData, setEditClassData] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      if (!userId || isNaN(userId)) {
        throw new Error('userId không hợp lệ');
      }
      const data = await fetchGroupsByInstructorId(userId);
      console.log('Dữ liệu nhóm từ API:', data);
      const enhancedGroups = await Promise.all(
        data.map(async (group, index) => {
          const classInfo = await fetchClassById(group.classId);
          return {
            ...group,
            ...classInfo,
            semester: classInfo.semester || 'Chưa xác định',
            avatarNumber: index + 1,
          };
        })
      );
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

  const handleClassCardClick = (classId) => {
    if (!classId || isNaN(classId)) {
      console.error('classId không hợp lệ');
      return;
    }
    navigate(`/userID/${userId}/instructor/classes/${classId}`);
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

  const handleEdit = (classId) => {
    const classToEdit = groups.find((group) => group.classId === classId);
    if (classToEdit) {
      setEditClassData(classToEdit);
      console.log('Opening EditClassPopup for:', classToEdit); // Debug log
    }
  };

  const handleUpdateClass = (updatedData) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.classId === editClassData.classId
          ? { ...group, ...updatedData }
          : group
      )
    );
    setEditClassData(null);
    loadData();
  };

  const handleGetLink = (classId) => {
    console.log(`Get link for class: ${classId}`);
  };

  const handleDelete = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/classes/delete/${classId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete class');
        }
        setGroups((prevGroups) => prevGroups.filter((group) => group.classId !== classId));
      } catch (err) {
        console.error('Error deleting class:', err.message);
      }
    }
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
              <div key={index} style={{ position: 'relative' }}>
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
                  onClick={() => handleClassCardClick(group.classId)}
                />
                <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1001 }}>
                  <InstructorClassCardMenu
                    classId={group.classId}
                    onGetLink={handleGetLink}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </div>
              </div>
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
      {editClassData && (
        <EditClassPopup
          classId={editClassData.classId}
          initialData={editClassData}
          onClose={() => setEditClassData(null)}
          onUpdate={handleUpdateClass}
        />
      )}
    </div>
  );
};

export default InstructorGroupPage;