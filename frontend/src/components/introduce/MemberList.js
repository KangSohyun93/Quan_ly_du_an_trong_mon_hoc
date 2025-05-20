import React from "react";
import MemberItem from "./MemberItem.js";
//import "./MembersList.css"; // Import CSS cho MembersList

function MembersList({ members }) {
  return (
    <div className="members-list">
      <h2>Thành viên ({members.length})</h2>
      <ul>
        {members.map((member, index) => (
          <MemberItem
            key={index}
            name={member.name}
            role={member.role}
            image={member.avatarUrl}
          />
        ))}
      </ul>
    </div>
  );
}

export default MembersList;
