import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InstructorClassCard from '../components/shared/InstructorClassCard/InstructorClassCard';
import '../assets/styles/global.css';
import './css/GroupPage.css';
import { fetchClassesByInstructorId } from '../services/instructorGroupService';

const InstructorGroupPage = () => {
  const { id } = useParams();
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await fetchClassesByInstructorId(id);
        setClasses(data);
      } catch (err) {
        setError('Không thể tải danh sách lớp');
      }
    };
    loadClasses();
  }, [id]);

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
        <button className="join-class-btn">Create Class</button>
      </div>

      <div className="card-container">
        {classes.length > 0 ? (
          classes.map((classItem, index) => (
            <InstructorClassCard
              key={index}
              className={classItem.className}
              groupCount={classItem.groupCount}
              projectNames={classItem.projectNames}
              memberCount={classItem.memberCount}
              avatarNumber={classItem.avatarNumber}
              avatarColor={classItem.avatarColor}
              members={classItem.members}
            />
          ))
        ) : (
          <p>Không tìm thấy lớp nào.</p>
        )}
      </div>
    </div>
  );
};

export default InstructorGroupPage;