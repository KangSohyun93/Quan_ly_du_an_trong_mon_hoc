// src/components/ClassCard/ClassCardList.jsx
import React from "react";
import ClassCard from "./ClassCard";

const ClassCardList = ({ data = [], loading }) => {
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
        <ClassCard key={index} {...card} />
      ))}
    </div>
  );
};

export default ClassCardList;
