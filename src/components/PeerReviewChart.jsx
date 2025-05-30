import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/peerreviewchart.css';

// Reusable ScoreDisplay component (giữ nguyên)
const ScoreDisplay = ({ score, maxScore = 5, label, barColorClass = '', showValueText = true }) => {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    const displayScore = score === null || score === undefined ? 0 : score;

    return (
        <div className="score-display">
            {label && <span className="score-label">{label}: </span>}
            <div className="score-bar-wrapper">
                <div className="score-bar-background">
                    <div
                        className={`score-bar-foreground ${barColorClass}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
            {showValueText && <span className="score-value-text">{Number(displayScore).toFixed(1)}/{maxScore}</span>}
        </div>
    );
};


const PeerReviewChart = ({ groupId }) => {
    const [peerReviewData, setPeerReviewData] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!groupId) {
            setPeerReviewData([]);
            setLoading(false);
            setError("Group ID is required to fetch peer reviews."); // Thêm thông báo lỗi rõ ràng hơn
            return;
        }
        const fetchPeerAssessments = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3000/api/groups/${groupId}/peer-assessments`);
                setPeerReviewData(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching peer assessments:', err);
                setError('Could not load peer review data.');
                setPeerReviewData([]);
            }
            setLoading(false);
        };
        fetchPeerAssessments();
    }, [groupId]);

    if (loading) {
        return (
            <div className="peerreview-chart-container">
                <h3>Peer Review</h3>
                <p>Loading review data...</p>
            </div>
        );
    }

    return (
        <div className="peerreview-chart-container">
            <h3>Peer Review</h3>
            {error && <p className="error-message">{error}</p>}
            {!error && peerReviewData.length === 0 && !loading && <p>No review data available for this group.</p>}
            {peerReviewData.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>Average Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {peerReviewData.map((member) => (
                            <tr key={member.name} onClick={() => setSelectedMember(member)} className="clickable-row">
                                <td>{member.name}</td>
                                <td className="score-cell">
                                    <ScoreDisplay score={member.score} maxScore={5} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {selectedMember && (
                <div className="peer-review-details">
                    <button onClick={() => setSelectedMember(null)} className="close-details-btn" title="Close details">
                        ×
                    </button>
                    <h4>Review Details for {selectedMember.name}</h4>
                    <div className="overall-average-section">
                        <strong>Overall Average: </strong>
                        <ScoreDisplay score={selectedMember.score} maxScore={5} showValueText={true} /> {/* Giữ lại showValueText cho điểm số */}
                    </div>
                    {/* Thay đổi ul thành div với class mới để dùng CSS Grid */}
                    <div className="reviews-grid">
                        {selectedMember.details.map((detail, index) => (
                            // Mỗi review là một item trong grid
                            <div key={index} className="review-item">
                                <div className="reviewer-info">Reviewed by: {detail.reviewer}</div>
                                <ScoreDisplay label="Overall for this review" score={detail.overallReviewScore} barColorClass="overall" />

                                <div className="comment-section">
                                    <span className="comment-label">Comment:</span>
                                    {detail.comment ? (
                                        <p className="comment-text">{detail.comment}</p>
                                    ) : (
                                        <p className="comment-text no-comment">No comment provided.</p>
                                    )}
                                </div>

                                <div className="criteria-scores">
                                    <ScoreDisplay label="Deadline Adherence" score={detail.scores.deadline} barColorClass="deadline" />
                                    <ScoreDisplay label="Friendliness & Respect" score={detail.scores.friendly} barColorClass="friendly" />
                                    <ScoreDisplay label="Quality of Work" score={detail.scores.quality} barColorClass="quality" />
                                    <ScoreDisplay label="Team Support" score={detail.scores.teamSupport} barColorClass="team-support" />
                                    <ScoreDisplay label="Responsibility" score={detail.scores.responsibility} barColorClass="responsibility" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeerReviewChart;