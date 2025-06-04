// src/components/shared/Rate/InstructorProjectRate.js
import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import {
  fetchInstructorEvaluations,
  saveInstructorEvaluation,
  updateInstructorEvaluation,
} from "../../../services/peer-assessment-service";
import "./ProjectRate.css";

function InstructorProjectRate() {
  const { members, currentUserId, projectId } = useOutletContext();
  const { groupId: urlGroupId } = useParams();
  const navigate = useNavigate();

  const [validMembers, setValidMembers] = useState([]);
  const [instructorEvaluations, setInstructorEvaluations] = useState({});
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidParam = (param) => {
    const value = parseInt(param, 10);
    return !isNaN(value) && value > 0;
  };

  const checkToken = () => {
    const token = sessionStorage.getItem("token");
    console.log("DEBUG: Checking token in InstructorProjectRate, token =", token);
    if (!token) {
      setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
      navigate("/login");
      return false;
    }
    return true;
  };

  const loadData = useCallback(async () => {
    if (!checkToken()) return;

    if (
      !isValidParam(projectId) ||
      !isValidParam(urlGroupId) ||
      !isValidParam(currentUserId)
    ) {
      setError(
        "Dữ liệu không hợp lệ: projectId, groupId hoặc currentUserId phải là số nguyên dương"
      );
      setLoading(false);
      const filteredMembers = (members || []).filter((m) => m && m.id);
      setValidMembers(filteredMembers);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const filteredMembers = (members || []).filter((m) => m && m.id);
      setValidMembers(filteredMembers);

      const instructorData = await fetchInstructorEvaluations({
        groupId: parseInt(urlGroupId, 10),
        projectId,
      });

      const instructorEvaluationMap = {};
      instructorData.forEach((e) => {
        instructorEvaluationMap[e.user_id] = {
          evaluationId: e.evaluation_id,
          score: e.score || 0,
          comments: e.comments || "",
        };
      });
      setInstructorEvaluations(instructorEvaluationMap);
    } catch (err) {
      const errorMessage = err.message || "Lỗi khi tải dữ liệu đánh giá";
      setError(`Lỗi: ${errorMessage}`);
      console.error("Error in InstructorProjectRate:", err);
      if (errorMessage.includes("token")) {
        navigate("/login");
      }
      const filteredMembers = (members || []).filter((m) => m && m.id);
      setValidMembers(filteredMembers);
    } finally {
      setLoading(false);
    }
  }, [members, currentUserId, projectId, urlGroupId, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle score change
  const handleScoreChange = (memberId, value) => {
    const score = Math.max(0, Math.min(100, parseInt(value, 10) || 0));
    setInstructorEvaluations((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        score,
      },
    }));
  };

  // Handle comments change
  const handleCommentsChange = (memberId, value) => {
    setInstructorEvaluations((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        comments: value,
      },
    }));
  };

  // Handle edit
  const handleEdit = (memberId) => {
    setEditingMemberId(memberId);
    if (!instructorEvaluations[memberId]) {
      setInstructorEvaluations((prev) => ({
        ...prev,
        [memberId]: {
          score: 0,
          comments: "",
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
    if (!checkToken()) return;

    if (
      !isValidParam(projectId) ||
      !isValidParam(urlGroupId) ||
      !isValidParam(currentUserId)
    ) {
      setError(
        "Dữ liệu không hợp lệ khi lưu: projectId, groupId hoặc currentUserId không hợp lệ"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      const evaluation = instructorEvaluations[memberId];
      const evaluationData = {
        instructor_id: currentUserId,
        user_id: memberId,
        score: evaluation.score,
        comments: evaluation.comments,
      };

      if (evaluation.evaluationId) {
        await updateInstructorEvaluation({
          groupId: parseInt(urlGroupId, 10),
          projectId,
          evaluationId: evaluation.evaluationId,
          evaluationData,
        });
      } else {
        await saveInstructorEvaluation({
          groupId: parseInt(urlGroupId, 10),
          projectId,
          evaluationData,
        });
      }
      setEditingMemberId(null);
      await loadData();
    } catch (err) {
      setError(err.message || "Lỗi khi lưu đánh giá");
      console.error("Error submitting evaluation:", err);
      if (err.message.includes("token")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !validMembers.length) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="projectrate-project-content">
      <h2>Đánh giá thành viên (Giảng viên)</h2>
      {error && <div className="projectrate-error-message">{error}</div>}
      {validMembers.length === 0 ? (
        <div>Không có thành viên nào để đánh giá</div>
      ) : (
        validMembers.map((member, index) => {
          const isEditing = editingMemberId === member.id;
          const evaluation = instructorEvaluations[member.id] || {
            score: 0,
            comments: "",
          };

          return (
            <div key={member.id} className="projectrate-task-item">
              <div className="projectrate-member-header">
                <div className="projectrate-member-info">
                  <img
                    src={
                      member.avatarUrl || "/assets/images/default-avatar.jpg"
                    }
                    alt={member.name || "Unknown"}
                    className="projectrate-member-avatar"
                    onError={(e) => {
                      e.target.src = "/assets/images/default-avatar.jpg";
                    }}
                  />
                  <h4>{`${index + 1}. ${member.name || "Unknown"}`}</h4>
                </div>
              </div>

              <div className="projectrate-instructor-evaluation-section">
                <div className="projectrate-rating-row">
                  <label>Score (0-100)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={evaluation.score}
                      onChange={(e) =>
                        handleScoreChange(member.id, e.target.value)
                      }
                      className="projectrate-input"
                    />
                  ) : (
                    <span className="projectrate-score-value">
                      {evaluation.score}
                    </span>
                  )}
                </div>
                <div className="projectrate-note-section">
                  <label>Comments</label>
                  {isEditing ? (
                    <textarea
                      value={evaluation.comments || ""}
                      onChange={(e) =>
                        handleCommentsChange(member.id, e.target.value)
                      }
                      placeholder="Enter your comments here..."
                      className="projectrate-textarea"
                    />
                  ) : (
                    <p className="projectrate-note-text">
                      {evaluation.comments || "No comments available"}
                    </p>
                  )}
                </div>
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

export default InstructorProjectRate;