import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InstructorEvaluationPopup.css';

// Helper to format date (consider using date-fns for more robust formatting)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (e) {
        return 'Invalid Date';
    }
};

const InstructorEvaluationPopup = ({ isOpen, onClose, groupId, projectId, userRole, loggedInUserId }) => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const [groupMembers, setGroupMembers] = useState({}); // For instructor view, to get student names

    useEffect(() => {
        if (!isOpen || !groupId || !projectId) {
            setEvaluations([]); // Clear evaluations when popup is closed or params missing
            setError(null);
            return;
        }

        const fetchEvaluations = async () => {
            setLoading(true);
            setError(null);

            const token = sessionStorage.getItem("token");
            console.log("[InstructorEvaluationPopup] Token from localStorage for API call:", token); // <<<< THÊM DÒNG NÀY
            console.log("[InstructorEvaluationPopup] Type of token:", typeof token);
            if (!token || typeof token !== 'string' || token === "null" || token.split('.').length !== 3) {
                console.error("[InstructorEvaluationPopup] Invalid or missing token from localStorage. Aborting API call.", token);
                setError("Không tìm thấy token hợp lệ. Vui lòng đăng nhập lại.");
                setLoading(false);
                setEvaluations([]); // Đảm bảo evaluations rỗng nếu không có token
                return; // Không thực hiện gọi API nếu token không hợp lệ
            }
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/peerassessment/groups/${groupId}/projects/${projectId}/instructor-evaluations`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setEvaluations(response.data || []);

                // If instructor, and we need to show names for all members even if no evaluation yet,
                // we might need another call to get group members.
                // For now, we rely on the 'user' object within each evaluation.
                // If displaying all members is a strict requirement for instructors, even those without evaluations,
                // this part would need expansion (e.g., fetch group members separately and map).
                // The current backend response provides evaluated students' info.

            } catch (err) {
                console.error('Error fetching instructor evaluations:', err);
                if (err.response) {
                    setError(err.response.data?.message || 'Không thể tải nhận xét của giảng viên. Lỗi từ server.');
                } else if (err.request) {
                    // Request được tạo nhưng không nhận được response (lỗi mạng, backend không chạy)
                    setError('Không thể kết nối đến server để tải nhận xét.');
                } else {
                    // Lỗi khác khi thiết lập request
                    setError('Lỗi khi gửi yêu cầu tải nhận xét.');
                }
                setEvaluations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEvaluations();
    }, [isOpen, groupId, projectId, userRole, loggedInUserId]);

    if (!isOpen) {
        return null;
    }

    const renderEvaluationCard = (evaluation, index) => (
        <div key={evaluation.evaluation_id || index} className="evaluation-card">
            {userRole === 'Instructor' && evaluation.user && (
                <h4 className="evaluation-student-name">
                    Nhận xét cho: {evaluation.user.username || 'Không rõ sinh viên'}
                </h4>
            )}
            {userRole === 'Student' && (
                <h4 className="evaluation-student-name">
                    Nhận xét từ giảng viên
                </h4>
            )}
            <div className="instructor-info">
                <img
                    src={evaluation.instructor?.avatar || 'https://via.placeholder.com/40?text=GV'}
                    alt={evaluation.instructor?.username || 'Giảng viên'}
                    className="instructor-avatar"
                />
                <span className="instructor-name">{evaluation.instructor?.username || 'Giảng viên không xác định'}</span>
            </div>
            <div className="evaluation-details">
                <p className="evaluation-score">
                    <strong>Điểm:</strong> {evaluation.score !== null && evaluation.score !== undefined ? evaluation.score : 'Chưa có điểm'}
                </p>
                <p className="evaluation-comments">
                    <strong>Nhận xét:</strong>
                    <span className="comments-text">{evaluation.comments || 'Không có nhận xét.'}</span>
                </p>
                <p className="evaluation-timestamp">
                    <strong>Ngày tạo:</strong> {formatDate(evaluation.created_at)}
                </p>
            </div>
            {/* Add a separator if not the last card and multiple evaluations */}
            {index < evaluations.length - 1 && <hr className="evaluation-separator" />}
        </div>
    );

    return (
        <div className="evaluation-popup-overlay">
            <div className="evaluation-popup-content">
                <button className="popup-close-btn" onClick={onClose} title="Đóng">
                    ×
                </button>
                <h3 className="popup-title">
                    {userRole === 'Instructor' ? 'Nhận xét của tôi cho nhóm' : 'Nhận xét từ Giảng viên'}
                </h3>
                {loading && <p className="loading-text">Đang tải nhận xét...</p>}
                {error && <p className="error-text">{error}</p>}
                {!loading && !error && evaluations.length === 0 && (
                    <p className="no-evaluations-text">
                        {userRole === 'Instructor'
                            ? 'Bạn chưa có nhận xét nào cho các thành viên trong nhóm này.'
                            : 'Hiện tại chưa có nhận xét nào từ giảng viên cho bạn trong nhóm này.'}
                    </p>
                )}
                {!loading && !error && evaluations.length > 0 && (
                    <div className="evaluations-list">
                        {evaluations.map(renderEvaluationCard)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorEvaluationPopup;