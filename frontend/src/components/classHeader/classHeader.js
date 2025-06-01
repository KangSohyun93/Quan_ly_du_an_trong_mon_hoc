import React, { useState } from "react";
import "./classHeader.css";
import { JoinClass } from "../../services/class-service";
import CreateClassPopup from "../shared/CreateClassPopup/CreateClassPopup";

const JoinClassBar = ({ onSearchChange, onJoinSuccess, onCreateSuccess }) => {
  const [joinCode, setJoinCode] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || null;
  const instructorId = user?.id;

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleJoinClick = () => setShowJoinPopup(true);
  const handleCreateClick = () => setShowCreatePopup(true);
  const handlePopupClose = () => {
    setShowJoinPopup(false);
    setShowCreatePopup(false);
  };

  const handlePopupJoin = async () => {
    try {
      const joinResponse = await JoinClass({ joinCode });
      console.log(joinResponse);
      setShowJoinPopup(false);
      if (onJoinSuccess) onJoinSuccess(); // 🔁 callback sau khi Join
    } catch (error) {
      console.error("Có lỗi khi tham gia:", error);
    }
  };

  const renderButton = () => {
    if (role === "Student") {
      return (
        <button className="join-class-button" onClick={handleJoinClick}>
          Join Class
        </button>
      );
    } else if (role === "Instructor") {
      return (
        <button className="join-class-button" onClick={handleCreateClick}>
          Create Class
        </button>
      );
    }
    return null;
  };

  return (
    <>
      <div className="join-class-container">
        <span className="join-class-label">Class</span>

        <div className="join-class-search-box">
          <span className="search-icon">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            className="join-class-input"
            placeholder=""
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>

        {renderButton()}
      </div>

      {/* Join Class Popup for Student */}
      {showJoinPopup && role === "Student" && (
        <div className="popup-join-team">
          <div className="popup-content">
            <button className="popup-close-button" onClick={handlePopupClose}>
              &times;
            </button>
            <div className="popup-image-placeholder">?</div>
            <h3 className="popup-title">Join a team with a code</h3>
            <input
              type="text"
              placeholder="Enter join code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="popup-input"
            />
            <button className="popup-join-button" onClick={handlePopupJoin}>
              Join
            </button>
          </div>
        </div>
      )}

      {/* Create Class Popup for Instructor */}
      {showCreatePopup && role === "Instructor" && (
        <CreateClassPopup
          instructorId={instructorId}
          onClose={handlePopupClose}
          onCreate={onCreateSuccess} // ✅ sử dụng callback riêng khi tạo lớp
        />
      )}
    </>
  );
};

export default JoinClassBar;
