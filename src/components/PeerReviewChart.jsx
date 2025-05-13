import React, { useState } from 'react';
import '../css/peerreviewchart.css';

const PeerReviewChart = () => {
    const peerReviewData = [
        { name: 'Alice', score: 8.5, details: [{ reviewer: 'Blice', score: 8, comment: 'Tốt' }, { reviewer: 'Clice', score: 9, comment: 'Xuất sắc' }] },
        { name: 'Blice', score: 7.8, details: [{ reviewer: 'Alice', score: 7.5, comment: 'Cần cải thiện' }, { reviewer: 'Clice', score: 8, comment: 'Tốt' }] },
        { name: 'Clice', score: 8.0, details: [{ reviewer: 'Alice', score: 8, comment: 'Tốt' }, { reviewer: 'Blice', score: 8, comment: 'Tốt' }] },
        { name: 'Dlice', score: 7.5, details: [{ reviewer: 'Alice', score: 7, comment: 'Khá' }, { reviewer: 'Blice', score: 8, comment: 'Tốt' }] },
        { name: 'Elice', score: 7.0, details: [{ reviewer: 'Alice', score: 7, comment: 'Khá' }, { reviewer: 'Blice', score: 7, comment: 'Khá' }] },
    ];

    const [selectedMember, setSelectedMember] = useState(null);

    return (
        <div className="peerreview-chart-container">
            <h3>Đánh giá ngang hàng</h3>
            <table>
                <thead>
                    <tr>
                        <th>Thành viên</th>
                        <th>Điểm trung bình</th>
                    </tr>
                </thead>
                <tbody>
                    {peerReviewData.map((member) => (
                        <tr key={member.name} onClick={() => setSelectedMember(member)}>
                            <td>{member.name}</td>
                            <td>
                                <div className="mini-bar" style={{ width: `${member.score * 10}%`, background: '#4CAF50' }}></div>
                                {member.score.toFixed(1)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedMember && (
                <div className="details">
                    <h4>Chi tiết đánh giá cho {selectedMember.name}</h4>
                    <ul>
                        {selectedMember.details.map((detail, index) => (
                            <li key={index}>{`${detail.reviewer}: ${detail.score} - ${detail.comment}`}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PeerReviewChart;