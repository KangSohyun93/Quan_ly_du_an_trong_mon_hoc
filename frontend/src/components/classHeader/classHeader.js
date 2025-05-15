import React, { useState, useEffect } from "react";
import "./classHeader.css";
import { SearchClass, JoinClass } from "../../services/class-service";
const JoinClassBar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [searchText, setSearchText] = useState("");
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
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchText.trim() !== "") {
        const searchResponse = await SearchClass({ searchText });
        console.log(searchResponse);
      } else {
        setResult([]); // nếu không có gì thì xoá kết quả
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

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
            onChange={(e) => setSearchText(e.target.value)}
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
