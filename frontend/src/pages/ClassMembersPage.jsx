import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/shared/SideBar/Sidebar';
import { fetchClassById, fetchMembersByClassId } from '../services/instructorGroupService';
import './css/ClassMembersPage.css';

const ClassMembersPage = () => {
  const { userId, classId } = useParams();
  const [members, setMembers] = useState([]);
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

        const memberData = await fetchMembersByClassId(classId);
        console.log('Dữ liệu thành viên từ API:', memberData);
        if (memberData && Array.isArray(memberData)) {
          setMembers(memberData);
        } else {
          setMembers([]);
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

  // Nhóm thành viên theo group_name
  const groupedMembers = members.reduce((acc, member) => {
    const groupName = member.group_name || 'Chưa có nhóm';
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(member);
    return acc;
  }, {});

  if (error) {
    return (
      <div className="class-members-page">
        <Sidebar userId={userId} />
        <div className="class-members-content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="class-members-page">
      <Sidebar userId={userId} />
      <div className="class-members-content">
        <div className="class-members-header">
          <div className="class-info">
            <h2>{classInfo?.class_name || 'Danh sách nhóm'}</h2>
            <div className="class-nav">
              <a href={`/userID/${userId}/instructor/classes/${classId}`}>Groups</a>
            </div>
          </div>
        </div>
        <div className="class-members-main">
          <div className="members-list">
            {loading ? (
              <div className="class-members-loading">Đang tải...</div>
            ) : Object.keys(groupedMembers).length > 0 ? (
              Object.keys(groupedMembers).map((groupName, index) => (
                <div key={index} className="group-section">
                  <h3>{groupName}</h3>
                  <ul>
                    {groupedMembers[groupName].map((member, idx) => (
                      <li key={idx} className="member-item">
                        <img
                          src={member.avatar}
                          alt={member.username}
                          className="member-avatar"
                        />
                        <div className="member-info">
                          <p className="member-name">{member.username}</p>
                          <p className="member-email">{member.email}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>Không có thành viên nào trong lớp học này.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassMembersPage;