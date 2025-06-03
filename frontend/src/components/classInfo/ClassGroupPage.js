import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GroupInClass from "../shared/GroupInClass/GroupInClass";
import ImportHeader from "../import/import";
import { getClassByGv } from "../../services/class-service";
import "./ClassGroupPage.css";

const ClassGroupsPage = () => {
  const { classId } = useParams();
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  const [groups, setGroups] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!userId || isNaN(userId) || !classId || isNaN(classId)) {
          throw new Error("userId hoặc classId không hợp lệ");
        }

        const classes = await getClassByGv();

        const selectedClass = classes.find(
          (c) => String(c.classId) === String(classId)
        );

        if (!selectedClass) {
          throw new Error(
            "Lớp học không tồn tại hoặc bạn không có quyền truy cập"
          );
        }

        setClassInfo({
          class_name: selectedClass.className,
          id: selectedClass.classId,
          semester: selectedClass.semester,
        });

        setGroups(selectedClass.groups || []);
      } catch (err) {
        setError(err.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Lỗi khi tải dữ liệu từ API:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, classId]);

  if (error) {
    return (
      <div className="class-groups-page">
        <div className="class-groups-content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="class-groups-page">
      <div className="class-groups-content">
        <div className="class-groups-header">
          <div className="class-info">
            <h2>{classInfo?.class_name || "Danh sách nhóm"}</h2>
            <div className="class-nav">
              <a href={`/instructor/home/classes/${classId}/members`}>
                Members
              </a>
            </div>
          </div>
        </div>
        <ImportHeader classId={classId} />
        <div className="class-groups-main">
          <div className="groups-list">
            {loading ? (
              <p>Đang tải...</p>
            ) : groups.length > 0 ? (
              groups.map((group) => (
                <GroupInClass
                  key={group.groupId || group.id}
                  group={group}
                  userId={userId}
                  classId={classId}
                />
              ))
            ) : (
              <p>Không có nhóm nào trong lớp học này.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassGroupsPage;