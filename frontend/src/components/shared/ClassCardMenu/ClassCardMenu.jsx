import React, { useState } from 'react';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';

const ClassCardMenu = ({ classId, onGetLink, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleGetLink = () => {
    if (onGetLink) onGetLink(classId);
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(classId);
    setIsOpen(false);
  };

  return (
    <div className="classcard-menu" style={{ position: 'relative' }}>
      <button
        onClick={handleToggle}
        className="classcard-menu-button"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          color: '#666',
          padding: '5px 10px',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
          ':hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
      >
        …
      </button>
      {isOpen && (
        <div
          className="classcard-menu-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            background: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            padding: '8px 0',
            zIndex: 10,
            minWidth: '150px',
            border: '1px solid #eee',
          }}
        >
          <button
            onClick={handleGetLink}
            className="classcard-menu-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '8px 16px',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#333',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <LinkIcon style={{ marginRight: '10px', fontSize: '18px', color: '#4a90e2' }} />
            Get link
          </button>
          <button
            onClick={handleDelete}
            className="classcard-menu-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '8px 16px',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#ff4444',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: '#fff1f1',
              },
            }}
          >
            <DeleteIcon style={{ marginRight: '10px', fontSize: '18px', color: '#ff4444' }} />
            Delete Class
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassCardMenu;