import React from "react";
import "./ProjectInfo.css"; // Import CSS cho ProjectInfo
import MembersList from "./MemberList.js"; // Đảm bảo đường dẫn đúng
import { FaGithub } from "react-icons/fa";

function ProjectInfo() {
  const projectName = "Phát triển phần mềm theo chuẩn kỹ năng ITSS";
  const projectCode = "IT4549";
  const groupCode = "5";
  const groupName = "5 anh em siêu nhân";
  const description =
    "Trang web giúp đỡ quản lý dự án, hỗ trợ theo dõi tiến trình công việc, đánh giá chéo công bằng giữa các thành viên.";
  const technologies = ["HTML", "CSS", "NodeJs", "ReactJS"];
  const githubLink =
    "https://github.com/KangSohyun93/Quan_ly_du_an_trong_mon_hoc"; // Thay bằng link GitHub thực tế
  const members = [
    { name: "Alice", role: "Project Manager" },
    { name: "Bob", role: "Member" },
    { name: "Charlie", role: "Member" },
    { name: "David", role: "Member" },
    { name: "Eve", role: "Member" },
  ];
  return (
    <div className="project-info-container">
      <div className="project-details">
        <h1>{projectName}</h1>
        <h2 className="project-code">{projectCode}</h2>
        <div className="group-info-gr">
          <h2>Group {groupCode}: </h2>
          <p className="group-name-gr">{groupName}</p>
        </div>
        <div className="group-info">
          <h2>Mô tả chủ đề: </h2>
          <p className="description">{description}</p>
        </div>
        <div className="technologies">
          <strong>Công cụ:</strong> {technologies.join(", ")}
        </div>
        <div className="github-link">
          <a href={githubLink}>
            <strong>Link GitHub</strong>
            <FaGithub className="icon" />
          </a>
        </div>
      </div>
      <span className="vertical-separator"></span>
      <div className="project-members">
        <MembersList members={members} />
      </div>
    </div>
  );
}

export default ProjectInfo;
