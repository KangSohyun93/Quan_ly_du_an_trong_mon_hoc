/* frontend/src/pages/Project.js */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TeamHeader from '../components/shared/TeamHeader/TeamHeader.jsx';
import { fetchProjectById, fetchTasksBySprintId } from '../services/groupService';
import './css/Project.css';

const Project = () => {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await fetchProjectById(projectId);
        setProjectData(data);
        if (data.sprints && data.sprints.length > 0) {
          setSelectedSprint(data.sprints[data.sprints.length - 1]);
        }
      } catch (err) {
        setError(`Không thể tải thông tin dự án: ${err.message}`);
      }
    };
    loadProject();
  }, [projectId]);

  useEffect(() => {
    const loadTasks = async () => {
      if (selectedSprint) {
        try {
          const taskData = await fetchTasksBySprintId(selectedSprint.sprint_id);
          setTasks(taskData);
        } catch (err) {
          console.error('Không thể tải danh sách task:', err);
          setTasks([]);
        }
      }
    };
    loadTasks();
  }, [selectedSprint]);

  const handleSprintChange = (sprint) => {
    setSelectedSprint(sprint);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!projectData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="project-page">
      <TeamHeader
        teamName={projectData.group_name || 'Name team'}
        members={projectData.members || []}
        activeTab="Team task"
        sprints={projectData.sprints || []}
        onSprintChange={handleSprintChange}
      />
      <div className="project-content">
        <h2>{projectData.project_name}</h2>
        <p>Group: {projectData.group_name}</p>
        <p>Members: {projectData.members?.length || 0}</p>
        {selectedSprint && (
          <>
            <h3>Tasks in {selectedSprint.sprint_name}</h3>
            {tasks.length > 0 ? (
              <ul>
                {tasks.map((task) => (
                  <li key={task.task_id}>
                    <strong>{task.title}</strong> - {task.description} (Status: {task.status}, Due: {new Date(task.due_date).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks found for this sprint.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Project;