import React, { useState, useEffect } from "react";
import "./classHeader.css";
import { JoinClass } from "../../services/class-service";
const JoinClassBar = ({ onSearchChange }) => {
  const [joinCode, setJoinCode] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };
  const [result, setResult] = useState([]);

  const handleJoinClick = () => setShowPopup(true);
  const handlePopupClose = () => setShowPopup(false);
  const handlePopupJoin = async () => {
    try {
      const joinResponse = await JoinClass({ joinCode });
      console.log(joinResponse);
      setShowPopup(false);
    } catch (error) {
      console.error("Có lỗi khi tham gia:", error);
    }
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

        <button className="join-class-button" onClick={handleJoinClick}>
          Join Class
        </button>
      </div>

      {showPopup && (
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
    </>
  );
};

export default JoinClassBar;
