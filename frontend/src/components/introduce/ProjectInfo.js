import React, { useEffect, useState } from "react";
import "./ProjectInfo.css";
import MembersList from "./MemberList";
import { FaGithub } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { fetchGroupData } from "../../services/group-service"; // Đường dẫn service đúng

function ProjectInfo() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchGroupData(id); // Gọi nhóm có ID = 5
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) return <div className="error">Lỗi: {error}</div>;
  if (!data) return <div className="loading">Đang tải dữ liệu...</div>;

  const { project, group, members } = data;
  return (
    <div className="project-info-container">
      <div className="project-details">
        <h1>{group.className}</h1>
        <h2 className="project-code">{project.code}</h2>
        <div className="group-info-gr">
          <h2>Group {group.code}: </h2>
          <p className="group-name-gr">{group.name}</p>
        </div>
        <div className="group-info">
          <h2>Mô tả chủ đề: </h2>
          <p className="description">{project.description}</p>
        </div>
        <div className="technologies">
          <strong>Công cụ:</strong> {project.technologies}
        </div>
        <div className="github-link">
          <a href={project.githubLink} target="_blank" rel="noreferrer">
            <strong>Link GitHub</strong> <FaGithub className="icon" />
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
