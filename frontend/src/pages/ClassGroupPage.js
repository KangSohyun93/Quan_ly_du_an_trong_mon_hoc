import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/shared/SideBar/Sidebar';
import GroupInClass from '../components/shared/GroupInClass/GroupInClass';
import { fetchClassById, fetchGroupsByClassId } from '../services/instructorGroupService';
import './css/ClassGroupPage.css';

const ClassGroupsPage = () => {
  const { userId, classId } = useParams();
  const [groups, setGroups] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (!userId || isNaN(userId) || !classId || isNaN(classId)) {
          throw new Error('userId hoặc classId không hợp lệ');
        }
        const classData = await fetchClassById(classId);
        setClassInfo(classData);

        const groupData = await fetchGroupsByClassId(classId);
        console.log('Dữ liệu nhóm từ API:', groupData);
        if (groupData && Array.isArray(groupData)) {
          setGroups(groupData);
        } else {
          setGroups([]);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('Error in loadData:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId, classId]);

  if (error) {
    return (
      <div className="class-groups-page">
        <Sidebar userId={userId} />
        <div className="class-groups-content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="class-groups-page">
      <Sidebar userId={userId} />
      <div className="class-groups-content">
        <div className="class-groups-header">
          <div className="class-info">
            <h2>{classInfo?.class_name || 'Danh sách nhóm'}</h2>
            <div className="class-nav">
              <a href={`/userID/${userId}/instructor/classes/${classId}/members`}>Members</a>
            </div>
          </div>
        </div>
        <div className="class-groups-main">
          <div className="groups-list">
            {loading ? (
              <p>Đang tải...</p>
            ) : groups.length > 0 ? (
              groups.map((group, index) => (
                <GroupInClass
                  key={index}
                  group={group}
                  userId={userId}
                  classId={classId}
                />
              ))
            ) : (
              <p>Không có nhóm nào trong lớp học này.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassGroupsPage;