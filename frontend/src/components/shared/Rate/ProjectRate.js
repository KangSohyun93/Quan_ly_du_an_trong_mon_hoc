// src/components/shared/Rate/ProjectRate.js
import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import {
  fetchPeerAssessments,
  fetchMemberTaskStats,
  savePeerAssessment,
  updatePeerAssessment,
} from "../../../services/peer-assessment-service";
import "./ProjectRate.css";

function ProjectRate() {
  const { members, currentUserId, projectId } = useOutletContext();
  const { groupId: urlGroupId } = useParams();

  const [validMembers, setValidMembers] = useState([]);
  const [assessments, setAssessments] = useState({});
  const [memberTaskStats, setMemberTaskStats] = useState({});
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidParam = (param) => {
    const value = parseInt(param, 10);
    return !isNaN(value) && value > 0;
  };

  const loadData = useCallback(async () => {
    console.log("Params in ProjectRate:", { projectId, groupId: urlGroupId, currentUserId });
    console.log("Members in ProjectRate:", members);

    if (!isValidParam(projectId) || !isValidParam(urlGroupId) || !isValidParam(currentUserId)) {
      setError("Dữ liệu không hợp lệ: projectId, groupId hoặc currentUserId phải là số nguyên dương");
      setLoading(false);
      console.warn("Invalid params in ProjectRate:", { projectId, groupId: urlGroupId, currentUserId });
      const filteredMembers = (members || []).filter((m) => m && m.id);
      setValidMembers(filteredMembers);
      console.log("Valid Members:", filteredMembers);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const filteredMembers = (members || []).filter((m) => m && m.id);
      setValidMembers(filteredMembers);
      console.log("Valid Members:", filteredMembers);

      const [assessmentData, taskStats] = await Promise.all([
        fetchPeerAssessments({ groupId: parseInt(urlGroupId, 10), projectId, assessorId: currentUserId }),
        fetchMemberTaskStats({ groupId: parseInt(urlGroupId, 10), projectId }),
      ]);

      const assessmentMap = {};
      assessmentData.forEach((a) => {
        assessmentMap[a.assessee_id] = {
          assessmentId: a.assessment_id,
          deadlineScore: a.deadline_score || 0,
          friendlyScore: a.friendly_score || 0,
          qualityScore: a.quality_score || 0,
          teamSupportScore: a.team_support_score || 0,
          responsibilityScore: a.responsibility_score || 0,
          note: a.note || "",
        };
      });
      setAssessments(assessmentMap);

      console.log("Task Stats from API:", taskStats);
const statsMap = {};
taskStats.forEach((s) => {
  const memberId = s.id; // Backend trả về id
  statsMap[memberId] = {
    totalTasksAssigned: s.total || 0,
    tasksCompleted: s.done || 0,
    toDo: s.toDo || 0,
    inProgress: s.inProgress || 0,
    delayedTasks: s.delayed || 0,
  };
});
setMemberTaskStats(statsMap);
console.log("Member Task Stats:", statsMap);

      setMemberTaskStats(statsMap);
      console.log("Member Task Stats:", statsMap);
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
      console.error("Error in ProjectRate:", err);
      const filteredMembers = (members || []).filter((m) => m && m.id);
      setValidMembers(filteredMembers);
      console.log("Valid Members:", filteredMembers);
    } finally {
      setLoading(false);
    }
  }, [members, currentUserId, projectId, urlGroupId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Render star rating
  const renderStars = (memberId, field, value, isEditing) => {
    const stars = [1, 2, 3, 4, 5];
    return stars.map((star) => (
      <span
        key={star}
        className={`projectrate-star ${star <= value ? "filled" : ""}`}
        onClick={isEditing ? () => handleStarClick(memberId, field, star) : null}
        style={{ cursor: isEditing ? "pointer" : "default" }}
      >
        ★
      </span>
    ));
  };

  // Render total rate
  const renderTotalRateStars = (memberId) => {
    const assessment = assessments[memberId] || {};
    const scores = [
      assessment.deadlineScore,
      assessment.friendlyScore,
      assessment.qualityScore,
      assessment.teamSupportScore,
      assessment.responsibilityScore,
    ].filter((s) => s > 0);
    const average = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const rounded = Math.round(average);
    return renderStars(memberId, "total", rounded, false);
  };

  // Handle star click
  const handleStarClick = (memberId, field, value) => {
    setAssessments((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value,
      },
    }));
  };

  // Handle note change
  const handleNoteChange = (memberId, value) => {
    setAssessments((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        note: value,
      },
    }));
  };

  // Handle edit
  const handleEdit = (memberId) => {
    setEditingMemberId(memberId);
    if (!assessments[memberId]) {
      setAssessments((prev) => ({
        ...prev,
        [memberId]: {
          deadlineScore: 0,
          friendlyScore: 0,
          qualityScore: 0,
          teamSupportScore: 0,
          responsibilityScore: 0,
          note: "",
        },
      }));
    }
  };

  // Handle cancel
  const handleCancel = (memberId) => {
    setEditingMemberId(null);
    loadData();
  };

  // Handle submit
  const handleSubmit = async (memberId) => {
    if (!isValidParam(projectId) || !isValidParam(urlGroupId) || !isValidParam(currentUserId)) {
      setError("Dữ liệu không hợp lệ khi lưu: projectId, groupId hoặc currentUserId không hợp lệ");
      console.warn("Invalid params on submit:", { projectId, groupId: urlGroupId, currentUserId });
      return;
    }

    try {
      setLoading(true);
      setError("");
      const assessment = assessments[memberId];
      const assessmentData = {
        assessor_id: currentUserId,
        assessee_id: memberId,
        deadline_score: assessment.deadlineScore,
        friendly_score: assessment.friendlyScore,
        quality_score: assessment.qualityScore,
        team_support_score: assessment.teamSupportScore,
        responsibility_score: assessment.responsibilityScore,
        note: assessment.note,
      };

      if (assessment.assessmentId) {
        await updatePeerAssessment({
          groupId: parseInt(urlGroupId, 10),
          projectId,
          assessmentId: assessment.assessmentId,
          assessmentData,
        });
      } else {
        await savePeerAssessment({ groupId: parseInt(urlGroupId, 10), projectId, assessmentData });
      }
      setEditingMemberId(null);
      await loadData();
    } catch (err) {
      setError(err.message || "Lỗi khi lưu đánh giá");
      console.error("Error submitting assessment:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !validMembers.length) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="projectrate-project-content">
      <h2>Đánh giá thành viên</h2>
      {error && <div className="projectrate-error-message">{error}</div>}
      {validMembers.length === 0 ? (
        <div>Không có thành viên nào để đánh giá</div>
      ) : (
        validMembers.map((member, index) => {
          const isEditing = editingMemberId === member.id;
          const taskStat = memberTaskStats[member.id] || {
            totalTasksAssigned: 0,
            tasksCompleted: 0,
            toDo: 0,
            inProgress: 0,
            delayedTasks: 0,
          };
          const assessment = assessments[member.id] || {
            deadlineScore: 0,
            friendlyScore: 0,
            qualityScore: 0,
            teamSupportScore: 0,
            responsibilityScore: 0,
            note: "",
          };

          return (
            <div key={member.id} className="projectrate-task-item">
              <div className="projectrate-member-header">
                <div className="projectrate-member-info">
                  <img
                    src={member.avatarUrl || "/assets/images/default-avatar.jpg"}
                    alt={member.name || "Unknown"}
                    className="projectrate-member-avatar"
                    onError={(e) => {
                      e.target.src = "/assets/images/default-avatar.jpg";
                    }}
                  />
                  <h4>{`${index + 1}. ${member.name || "Unknown"}`}</h4>
                </div>
                <div className="projectrate-member-stats">
                  <span>
                    TASK DONE: {taskStat.tasksCompleted}/{taskStat.totalTasksAssigned}
                  </span>
                  <span>TO DO: {taskStat.toDo}</span>
                  <span>IN PROGRESS: {taskStat.inProgress}</span>
                  <span>DELAYED: {taskStat.delayedTasks}</span>
                </div>
              </div>

              <div className="projectrate-rating-section">
                <div className="projectrate-rating-column">
                  {[
                    { label: "Deadline", field: "deadlineScore" },
                    { label: "Friendly", field: "friendlyScore" },
                    { label: "Responsibility", field: "responsibilityScore" },
                  ].map(({ label, field }) => (
                    <div
                      key={`${member.id}-${field}`}
                      className="projectrate-rating-row"
                    >
                      <label>{label}</label>
                      <div className="projectrate-stars">
                        {renderStars(
                          member.id,
                          field,
                          assessment[field],
                          isEditing
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="projectrate-rating-column">
                  {[
                    { label: "Quality", field: "qualityScore" },
                    { label: "Team Support", field: "teamSupportScore" },
                    { label: "Total", field: "total" },
                  ].map(({ label, field }) => (
                    <div
                      key={`${member.id}-${field}`}
                      className="projectrate-rating-row"
                    >
                      <label>{label}</label>
                      <div className="projectrate-stars">
                        {field === "total"
                          ? renderTotalRateStars(member.id)
                          : renderStars(
                              member.id,
                              field,
                              assessment[field],
                              isEditing
                            )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="projectrate-note-section">
                <label>Note</label>
                {isEditing ? (
                  <textarea
                    value={assessment.note || ""}
                    onChange={(e) => handleNoteChange(member.id, e.target.value)}
                    placeholder="Enter your note here..."
                    className="projectrate-textarea"
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
                      onClick={() => handleCancel(member.id)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      className="projectrate-confirm-button"
                      onClick={() => handleSubmit(member.id)}
                      disabled={loading}
                    >
                      Confirm
                    </button>
                  </>
                ) : (
                  <button
                    className="projectrate-edit-button"
                    onClick={() => handleEdit(member.id)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ProjectRate;