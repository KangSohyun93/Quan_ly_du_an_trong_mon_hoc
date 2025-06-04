import React from 'react';
import './InstructorEvaluationButton.css';
// Make sure you have fontawesome setup or use another icon library
// For example, using a simple text icon if fontawesome is not available:
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

const InstructorEvaluationButton = ({ onClick, userRole }) => {
    const buttonText = userRole === 'Instructor' ? 'Xem nhận xét của tôi' : 'Xem nhận xét GV';

    return (
        <button className="instructor-eval-button" onClick={onClick} title={buttonText}>
            <FontAwesomeIcon icon={faCommentDots} />
            {/* <span className="icon-placeholder">💬</span> Placeholder if no FontAwesome */}
            <span className="button-text">{buttonText}</span>
        </button>
    );
};

export default InstructorEvaluationButton;