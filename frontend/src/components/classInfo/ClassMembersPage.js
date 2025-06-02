import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../shared/Sidebar/Sidebar";
import { getClassByGv } from "../../services/class-service";
import "./ClassMembersPage.css";

const ClassMembersPage = () => {
  const { classId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [members, setMembers] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (!userId || isNaN(userId) || !classId || isNaN(classId)) {
          throw new Error("userId hoặc classId không hợp lệ");
        }

        const allClasses = await getClassByGv();

        const selectedClass = allClasses.find(
          (cls) => String(cls.classId) === String(classId)
        );

        if (!selectedClass) {
          throw new Error("Không tìm thấy lớp học");
        }

        setClassInfo({
          class_name: selectedClass.className,
          id: selectedClass.classId,
        });

        const memberMap = {};
        selectedClass.members.forEach((m) => {
          memberMap[m.id] = {
            id: m.id,
            username: m.username,
            email: m.email || "no-email@example.com",
            avatar: m.avatar,
            group_name: null,
          };
        });

        selectedClass.groups.forEach((group) => {
          group.members.forEach((gm) => {
            if (memberMap[gm.id]) {
              memberMap[gm.id].group_name = group.groupName;
            }
          });
        });

        setMembers(Object.values(memberMap));
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err.message);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, classId]);

  const groupedMembers = members.reduce((acc, member) => {
    const groupName = member.group_name || "Chưa có nhóm";
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(member);
    return acc;
  }, {});

  if (error) {
    return (
      <div className="class-members-page">
        <Sidebar userId={userId} />
        <div className="class-members-content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="class-members-page">
      <Sidebar userId={userId} />
      <div className="class-members-content">
        <div className="class-members-header">
          <div className="class-info">
            <h2>{classInfo?.class_name || "Danh sách thành viên"}</h2>
            <div className="class-nav">
              <a href={`/instructor/home/classes/${classId}`}>Groups</a>
            </div>
          </div>
        </div>
        <div className="class-members-main">
          <div className="members-list">
            {loading ? (
              <div className="class-members-loading">Đang tải...</div>
            ) : Object.keys(groupedMembers).length > 0 ? (
              Object.entries(groupedMembers).map(
                ([groupName, groupMembers], index) => (
                  <div key={index} className="group-section">
                    <h3>{groupName}</h3>
                    <ul>
                      {groupMembers.map((member, idx) => (
                        <li key={idx} className="member-item">
                          <img
                            src={member.avatar || "/default-avatar.png"}
                            alt={member.username}
                            className="member-avatar"
                          />
                          <div className="member-info">
                            <p className="member-name">{member.username}</p>
                            <p className="member-email">{member.email}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )
            ) : (
              <p>Không có thành viên nào trong lớp học này.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassMembersPage;
