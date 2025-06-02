// src/components/ClassCard/ClassCardList.jsx
import React from "react";
import InstructorClassCard from "./InstructorClassCard";

const ClassCardList = ({ data = [], loading, onEdit }) => {
  if (loading) return <div>Loading...</div>;

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "60px",
    padding: "20px",
  };

  return (
    <div style={gridStyle}>
      {data.map((card, index) => (
        <InstructorClassCard
          key={index}
          {...card}
          onEdit={onEdit} // ✅ Truyền onEdit xuống đây
        />
      ))}
    </div>
  );
};

export default ClassCardList;
