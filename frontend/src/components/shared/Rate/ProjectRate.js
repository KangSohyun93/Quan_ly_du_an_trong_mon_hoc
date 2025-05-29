import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  fetchPeerAssessments,
  savePeerAssessment,
  fetchMemberTaskStats,
} from "../../../services/assessment-service";
import "./ProjectRate.css";

const ProjectRate = () => {
  const { currentUserId, projectId, members, projectData, groupId } =
    useOutletContext();

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
        const assessmentsData = await fetchPeerAssessments(
          projectId,
          currentUserId,
          groupId
        );
        const existingAssessments = assessmentsData.reduce((acc, item) => {
          acc[item.assessee_id] = {
            deadlineScore: item.deadline_score || 0,
            friendlyScore: item.friendly_score || 0,
            qualityScore: item.quality_score || 0,
            teamSupportScore: item.team_support_score || 0,
            responsibilityScore: item.responsibility_score || 0,
            note: item.note || "",
          };
          return acc;
        }, {});
        setAssessments(existingAssessments);
        setOriginalAssessments(existingAssessments);

        const taskStats = await fetchMemberTaskStats(projectId, groupId);
        setMemberTaskStats(taskStats);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Error fetching data:", err.message, err.stack);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId, currentUserId]);

  const handleRatingChange = (id, field, value) => {
    setAssessments((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleNoteChange = (id, value) => {
    setAssessments((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        note: value,
      },
    }));
  };

  const handleEdit = (id) => setEditingMemberId(id);

  const handleCancel = (id) => {
    setAssessments((prev) => ({
      ...prev,
      [id]: { ...originalAssessments[id] },
    }));
    setEditingMemberId(null);
  };

  const handleSubmit = async (id) => {
    setLoading(true);
    try {
      await savePeerAssessment(
        projectId,
        {
          assessorId: currentUserId,
          assesseeId: id,
          ...assessments[id],
          projectId,
        },
        groupId
      );
      setOriginalAssessments((prev) => ({
        ...prev,
        [id]: { ...assessments[id] },
      }));
      alert("Đánh giá đã được lưu!");
      setEditingMemberId(null);
    } catch (err) {
      setError("Lỗi khi lưu đánh giá.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (id, field, value, editable) =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`projectrate-star ${i + 1 <= value ? "filled" : ""} ${
          editable ? "editable" : ""
        }`}
        onClick={
          editable ? () => handleRatingChange(id, field, i + 1) : undefined
        }
      >
        ★
      </span>
    ));

  const calculateTotalRate = (id) => {
    const scores = assessments[id] || {};
    const {
      deadlineScore = 0,
      friendlyScore = 0,
      qualityScore = 0,
      teamSupportScore = 0,
      responsibilityScore = 0,
    } = scores;
    return Math.round(
      (deadlineScore +
        friendlyScore +
        qualityScore +
        teamSupportScore +
        responsibilityScore) /
        5
    );
  };

  const renderTotalRateStars = (id) => {
    const total = calculateTotalRate(id);
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`projectrate-star ${i + 1 <= total ? "filled" : ""}`}
      >
        ★
      </span>
    ));
  };

  if (error) return <div className="projectrate-error-message">{error}</div>;
  if (loading || !projectData)
    return <div className="projectrate-loading">Đang tải...</div>;

  return (
    <div className="projectrate-project-content">
      <h2>Đánh giá thành viên</h2>
      {members.map((member, index) => {
        const isEditing = editingMemberId === member.user_id;
        const taskStat = memberTaskStats[member.user_id] || {};
        const assessment = assessments[member.user_id] || {};
        return (
          <div key={member.user_id} className="projectrate-task-item">
            <div className="projectrate-member-header">
              <div className="projectrate-member-info">
                <img
                  src={member.avatar || "/assets/images/default-avatar.jpg"}
                  alt={member.username}
                  className="projectrate-member-avatar"
                />
                <h4>{`${index + 1}. ${member.username}`}</h4>
              </div>
              <div className="projectrate-member-stats">
                <span>
                  TASK DONE: {taskStat.tasksCompleted || 0}/
                  {taskStat.totalTasksAssigned || 0}
                </span>
                <span>DELAYED: {taskStat.delayedTasks || 0}</span>
              </div>
            </div>

            <div className="projectrate-rating-section">
              <div className="projectrate-rating-column">
                <div className="projectrate-rating-row">
                  <label>Deadline</label>
                  <div className="projectrate-stars">
                    {renderStars(
                      member.user_id,
                      "deadlineScore",
                      assessment.deadlineScore,
                      isEditing
                    )}
                  </div>
                </div>
                <div className="projectrate-rating-row">
                  <label>Friendly</label>
                  <div className="projectrate-stars">
                    {renderStars(
                      member.user_id,
                      "friendlyScore",
                      assessment.friendlyScore,
                      isEditing
                    )}
                  </div>
                </div>
                <div className="projectrate-rating-row">
                  <label>Responsibility</label>
                  <div className="projectrate-stars">
                    {renderStars(
                      member.user_id,
                      "responsibilityScore",
                      assessment.responsibilityScore,
                      isEditing
                    )}
                  </div>
                </div>
              </div>
              <div className="projectrate-rating-column">
                <div className="projectrate-rating-row">
                  <label>Quality</label>
                  <div className="projectrate-stars">
                    {renderStars(
                      member.user_id,
                      "qualityScore",
                      assessment.qualityScore,
                      isEditing
                    )}
                  </div>
                </div>
                <div className="projectrate-rating-row">
                  <label>Team Support</label>
                  <div className="projectrate-stars">
                    {renderStars(
                      member.user_id,
                      "teamSupportScore",
                      assessment.teamSupportScore,
                      isEditing
                    )}
                  </div>
                </div>
                <div className="projectrate-rating-row">
                  <label>Total</label>
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
                  value={assessment.note}
                  onChange={(e) =>
                    handleNoteChange(member.user_id, e.target.value)
                  }
                  placeholder="Enter your note here..."
                />
              ) : (
                <p className="projectrate-note-text">
                  {assessment.note || "No note available"}
                </p>
              )}
            </div>

            <div className="projectrate-action-buttons">
              {isEditing ? (
                <>
                  <button
                    className="projectrate-cancel-button"
                    onClick={() => handleCancel(member.user_id)}
                  >
                    Cancel
                  </button>
                  <button
                    className="projectrate-confirm-button"
                    onClick={() => handleSubmit(member.user_id)}
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <button
                  className="projectrate-edit-button"
                  onClick={() => handleEdit(member.user_id)}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectRate;
