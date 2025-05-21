import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/shared/SideBar/Sidebar';
import TeamHeader from '../components/shared/TeamHeader/TeamHeader';
import { fetchGroupMembers, fetchPeerAssessments, savePeerAssessment, fetchProjectById, fetchMemberTaskStats } from '../services/groupService';
import './css/ProjectRate.css';

const ProjectRate = () => {
  const { userId, classId, projectId, sprintId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [members, setMembers] = useState([]);
  const [assessments, setAssessments] = useState({});
  const [originalAssessments, setOriginalAssessments] = useState({});
  const [memberTaskStats, setMemberTaskStats] = useState({});
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(`Gọi API với projectId: ${projectId}, userId: ${userId}`);
        const project = await fetchProjectById(projectId);
        setProjectData(project);

        const membersData = await fetchGroupMembers(projectId);
        setMembers(membersData);

        const assessmentsData = await fetchPeerAssessments(projectId, userId);
        console.log('Dữ liệu đánh giá:', assessmentsData);
        const existingAssessments = assessmentsData.reduce((acc, item) => {
          acc[item.assessee_id] = {
            deadlineScore: item.deadline_score || 0,
            friendlyScore: item.friendly_score || 0,
            qualityScore: item.quality_score || 0,
            teamSupportScore: item.team_support_score || 0,
            responsibilityScore: item.responsibility_score || 0,
            note: item.note || '',
          };
          return acc;
        }, {});
        setAssessments(existingAssessments);
        setOriginalAssessments(existingAssessments);

        const memberTaskStatsData = await fetchMemberTaskStats(projectId);
        setMemberTaskStats(memberTaskStatsData);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('Error fetching data:', err.message, err.stack);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId, userId]);

  const handleRatingChange = (assesseeId, category, value) => {
    setAssessments((prev) => ({
      ...prev,
      [assesseeId]: {
        ...prev[assesseeId],
        [category]: value,
      },
    }));
  };

  const handleNoteChange = (assesseeId, value) => {
    setAssessments((prev) => ({
      ...prev,
      [assesseeId]: {
        ...prev[assesseeId],
        note: value,
      },
    }));
  };

  const handleEdit = (memberId) => {
    setEditingMemberId(memberId);
  };

  const handleCancel = (memberId) => {
    setAssessments((prev) => ({
      ...prev,
      [memberId]: { ...originalAssessments[memberId] },
    }));
    setEditingMemberId(null);
  };

  const handleSubmit = async (memberId) => {
    setLoading(true);
    try {
      await savePeerAssessment(projectId, {
        assessorId: parseInt(userId, 10),
        assesseeId: parseInt(memberId, 10),
        ...assessments[memberId],
        projectId: parseInt(projectId, 10),
      });
      setOriginalAssessments((prev) => ({
        ...prev,
        [memberId]: { ...assessments[memberId] },
      }));
      alert('Đánh giá đã được lưu thành công!');
      setEditingMemberId(null);
    } catch (err) {
      setError('Lỗi khi lưu đánh giá. Vui lòng thử lại.');
      console.error('Error saving assessments:', err.message, err.stack);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (assesseeId, category, value, editable = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`projectrate-star ${i <= value ? 'filled' : ''} ${editable ? 'editable' : ''}`}
          onClick={editable ? () => handleRatingChange(assesseeId, category, i) : undefined}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const calculateTotalRate = (assesseeId) => {
    const scores = assessments[assesseeId] || {};
    const { deadlineScore = 0, friendlyScore = 0, qualityScore = 0, teamSupportScore = 0, responsibilityScore = 0 } = scores;
    const total = (deadlineScore + friendlyScore + qualityScore + teamSupportScore + responsibilityScore) / 5;
    return Math.round(total);
  };

  const renderTotalRateStars = (assesseeId) => {
    const totalRate = calculateTotalRate(assesseeId);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`projectrate-star ${i <= totalRate ? 'filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (error) return <div className="projectrate-error-message">{error}</div>;
  if (loading || !projectData) return <div className="projectrate-loading">Đang tải...</div>;

  return (
    <div className="projectrate-project-rate">
      <Sidebar userId={userId} />
      <div className="projectrate-content-container">
        <TeamHeader
          className={projectData.class_name || 'Tên lớp'}
          classCode={projectData.class_id || '100001'}
          teamName={projectData.group_name || 'Name team'}
          projectName={projectData.project_name || 'Team project'}
          members={projectData.members || []}
          activeTab="Rate"
          sprints={projectData.sprints || []}
          selectedSprintId={sprintId}
          onSprintChange={() => {}}
          onTabChange={() => {}}
        />
        <div className="projectrate-project-content">
          <h2>Đánh giá thành viên</h2>
          {members.map((member, index) => {
            const isEditing = editingMemberId === member.user_id;
            return (
              <div key={member.user_id} className="projectrate-task-item">
                <div className="projectrate-member-header">
                  <div className="projectrate-member-info">
                    <img 
                      src={member.avatar || '/assets/images/default-avatar.jpg'} // Sử dụng đường dẫn trực tiếp
                      alt={member.username} 
                      className="projectrate-member-avatar" 
                    />
                    <div>
                      <h4>{`${index + 1}. ${member.username}`}</h4>
                    </div>
                  </div>
                  <div className="projectrate-member-stats">
                    <span>
                      TOTAL TASK DONE: {memberTaskStats[member.user_id]?.tasksCompleted || 0}/{memberTaskStats[member.user_id]?.totalTasksAssigned || 0}
                    </span>
                    <span>
                      DELAY DEADLINE: {memberTaskStats[member.user_id]?.delayedTasks || 0}
                    </span>
                  </div>
                </div>
                <div className="projectrate-rating-section">
                  <div className="projectrate-rating-column">
                    <div className="projectrate-rating-row">
                      <label>Deadline</label>
                      <div className="projectrate-stars">
                        {renderStars(member.user_id, 'deadlineScore', assessments[member.user_id]?.deadlineScore || 0, isEditing)}
                      </div>
                    </div>
                    <div className="projectrate-rating-row">
                      <label>Friendly</label>
                      <div className="projectrate-stars">
                        {renderStars(member.user_id, 'friendlyScore', assessments[member.user_id]?.friendlyScore || 0, isEditing)}
                      </div>
                    </div>
                    <div className="projectrate-rating-row">
                      <label>Responsibility</label>
                      <div className="projectrate-stars">
                        {renderStars(member.user_id, 'responsibilityScore', assessments[member.user_id]?.responsibilityScore || 0, isEditing)}
                      </div>
                    </div>
                  </div>
                  <div className="projectrate-rating-column">
                    <div className="projectrate-rating-row">
                      <label>Quality of work</label>
                      <div className="projectrate-stars">
                        {renderStars(member.user_id, 'qualityScore', assessments[member.user_id]?.qualityScore || 0, isEditing)}
                      </div>
                    </div>
                    <div className="projectrate-rating-row">
                      <label>Team Support</label>
                      <div className="projectrate-stars">
                        {renderStars(member.user_id, 'teamSupportScore', assessments[member.user_id]?.teamSupportScore || 0, isEditing)}
                      </div>
                    </div>
                    <div className="projectrate-rating-row">
                      <label>TOTAL RATE</label>
                      <div className="projectrate-stars">
                        {renderTotalRateStars(member.user_id)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="projectrate-note-section">
                  <label>Note</label>
                  {isEditing ? (
                    <textarea
                      value={assessments[member.user_id]?.note || ''}
                      onChange={(e) => handleNoteChange(member.user_id, e.target.value)}
                      placeholder="Enter your note here..."
                    />
                  ) : (
                    <p className="projectrate-note-text">{assessments[member.user_id]?.note || 'No note available'}</p>
                  )}
                </div>
                <div className="projectrate-action-buttons">
                  {isEditing ? (
                    <>
                      <button className="projectrate-cancel-button" onClick={() => handleCancel(member.user_id)}>CANCEL</button>
                      <button className="projectrate-confirm-button" onClick={() => handleSubmit(member.user_id)}>CONFIRM</button>
                    </>
                  ) : (
                    <button className="projectrate-edit-button" onClick={() => handleEdit(member.user_id)}>EDIT</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectRate;