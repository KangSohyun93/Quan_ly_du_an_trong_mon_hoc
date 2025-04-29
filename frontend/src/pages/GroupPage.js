/* frontend/src/pages/GroupPage.js */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClassCard from '../components/shared/ClassCard/ClassCard';
import '../assets/styles/global.css';
import './css/GroupPage.css';
import { fetchGroupsByUserId } from '../services/groupService';

const GroupPage = () => {
  const { userId } = useParams();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await fetchGroupsByUserId(userId);
        setGroups(data);
      } catch (err) {
        setError('Không thể tải danh sách nhóm');
      }
    };
    loadGroups();
  }, [userId]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Classes</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
        <button className="join-class-btn">Join Class</button>
      </div>

      <div className="card-container">
        {groups.length > 0 ? (
          groups.map((group, index) => (
            <ClassCard
              key={index}
              classId={group.classId} // Thêm classId
              className={group.className}
              groupName={group.groupName}
              projectName={group.projectName}
              memberCount={group.memberCount}
              avatarNumber={group.avatarNumber}
              avatarColor={group.avatarColor}
              members={group.members}
            />
          ))
        ) : (
          <p>Không tìm thấy nhóm nào.</p>
        )}
      </div>
    </div>
  );
};

export default GroupPage;