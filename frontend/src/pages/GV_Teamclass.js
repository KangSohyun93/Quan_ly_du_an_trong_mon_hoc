import React, { useEffect, useState } from "react";
import Sidebar from "../components/shared/Sidebar/Sidebar.js";
import JoinClassBar from "../components/classHeader/classHeader.js";
import ClassCardList from "../components/shared/InstructorClassCard/instructorClassList.js";
import EditClassPopup from "../components/shared/EditClassPopup/EditClassPopup.js";
import { SearchClass, getClassByGv } from "../services/class-service.js";

function GV_TeamClass() {
  const [searchText, setSearchText] = useState("");
  const [classCards, setClassCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClass, setEditingClass] = useState(null); // ✅ Quản lý popup

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem("user"))?.id;

      if (searchText.trim() !== "") {
        const searchResult = await SearchClass({ searchText });
        const filtered = searchResult.filter((c) => c.instructorId === userId);
        setClassCards(Array.isArray(filtered) ? filtered : []);
      } else {
        const allClasses = await getClassByGv();
        setClassCards(Array.isArray(allClasses) ? allClasses : []);
      }
    } catch (err) {
      console.error("Error fetching class data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchClasses();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const handleEditClass = (classId) => {
    const classToEdit = classCards.find((c) => c.classId === classId);
    if (classToEdit) setEditingClass(classToEdit);
  };

  return (
    <div
      className="app-content d-flex"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <div style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ overflow: "hidden" }}
      >
        <JoinClassBar
          onSearchChange={setSearchText}
          onCreateSuccess={fetchClasses}
        />
        <div
          className="page-content p-4"
          style={{
            flexGrow: 1,
            overflowY: "auto",
            height: "100%",
          }}
        >
          <ClassCardList
            data={classCards}
            loading={loading}
            onEdit={handleEditClass} // ✅ Truyền hàm mở popup
          />
        </div>
      </div>

      {/* ✅ Popup chỉnh sửa lớp */}
      {editingClass && (
        <EditClassPopup
          classId={editingClass.classId}
          initialData={editingClass}
          onClose={() => setEditingClass(null)}
          onUpdate={() => {
            setEditingClass(null);
            fetchClasses();
          }}
        />
      )}
    </div>
  );
}

export default GV_TeamClass;
