// import React, { useState } from 'react';
// import '../css/peerreviewchart.css';

// const PeerReviewChart = () => {
//     const peerReviewData = [
//         { name: 'Alice', score: 8.5, details: [{ reviewer: 'Blice', score: 8, comment: 'Tốt' }, { reviewer: 'Clice', score: 9, comment: 'Xuất sắc' }] },
//         { name: 'Blice', score: 7.8, details: [{ reviewer: 'Alice', score: 7.5, comment: 'Cần cải thiện' }, { reviewer: 'Clice', score: 8, comment: 'Tốt' }] },
//         { name: 'Clice', score: 8.0, details: [{ reviewer: 'Alice', score: 8, comment: 'Tốt' }, { reviewer: 'Blice', score: 8, comment: 'Tốt' }] },
//         { name: 'Dlice', score: 7.5, details: [{ reviewer: 'Alice', score: 7, comment: 'Khá' }, { reviewer: 'Blice', score: 8, comment: 'Tốt' }] },
//         { name: 'Elice', score: 7.0, details: [{ reviewer: 'Alice', score: 7, comment: 'Khá' }, { reviewer: 'Blice', score: 7, comment: 'Khá' }] },
//     ];

//     const [selectedMember, setSelectedMember] = useState(null);

//     return (
//         <div className="peerreview-chart-container">
//             <h3>Đánh giá ngang hàng</h3>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Thành viên</th>
//                         <th>Điểm trung bình</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {peerReviewData.map((member) => (
//                         <tr key={member.name} onClick={() => setSelectedMember(member)}>
//                             <td>{member.name}</td>
//                             <td>
//                                 <div className="mini-bar" style={{ width: `${member.score * 10}%`, background: '#4CAF50' }}></div>
//                                 {member.score.toFixed(1)}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             {selectedMember && (
//                 <div className="details">
//                     <h4>Chi tiết đánh giá cho {selectedMember.name}</h4>
//                     <ul>
//                         {selectedMember.details.map((detail, index) => (
//                             <li key={index}>{`${detail.reviewer}: ${detail.score} - ${detail.comment}`}</li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PeerReviewChart;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/peerreviewchart.css';

const PeerReviewChart = ({ groupId }) => {
    const [peerReviewData, setPeerReviewData] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPeerAssessments = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/groups/${groupId}/peer-assessments`);
                setPeerReviewData(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching peer assessments:', err);
                setError('Không thể tải dữ liệu đánh giá ngang hàng');
                setPeerReviewData([]);
            }
        };
        fetchPeerAssessments();
    }, [groupId]);

    return (
        <div className="peerreview-chart-container">
            <h3>Đánh giá ngang hàng</h3>
            {error && <p className="error">{error}</p>}
            {peerReviewData.length === 0 && !error && <p>Không có dữ liệu đánh giá</p>}
            {peerReviewData.length > 0 && (
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
            )}
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