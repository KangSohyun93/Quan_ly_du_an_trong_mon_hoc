import React, { useState } from "react";
import { createSprint } from "../../../services/api-client";
import "./AddSprintModal.css";

const AddSprintModal = ({ projectId, onClose, onSprintCreated }) => {
  const [sprintName, setSprintName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleAddSprint = async (e) => {
    e.preventDefault();
    try {
      const response = await createSprint({
        project_id: projectId,
        sprint_name: sprintName,
        start_date: startDate,
        end_date: endDate,
      });
      if (response.sprintId) {
        onSprintCreated({ sprint_id: response.sprintId });
        onClose();
        setSprintName("");
        setStartDate("");
        setEndDate("");
      } else {
        console.error("Error adding sprint: No sprintId returned");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error adding sprint:", error);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Add New Sprint</h3>
        <form onSubmit={handleAddSprint}>
          <div className="form-group">
            <label>Sprint Name:</label>
            <input
              type="text"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Create Sprint
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSprintModal;
