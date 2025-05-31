import React, { useEffect, useState } from "react";
import Sidebar from "../components/shared/Sidebar/Sidebar.js";
import JoinClassBar from "../components/classHeader/classHeader.js";
import ClassCardList from "../components/shared/ClassCard/classList.js";
import { SearchClass, getClassByGv } from "../services/class-service.js";

function GV_TeamClass() {
  const [searchText, setSearchText] = useState("");
  const [classCards, setClassCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      if (searchText.trim() !== "") {
        const searchResult = await SearchClass({ searchText });

        // Lọc các lớp tìm được có instructorId = userId
        const userId = JSON.parse(localStorage.getItem("user"))?.id;
        console.log("User ID:", userId);
        const filteredClasses = searchResult.filter(
          (c) => c.instructorId === userId
        );
        console.log("Filtered Classes:", filteredClasses);
        setClassCards(Array.isArray(filteredClasses) ? filteredClasses : []);
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
          onJoinSuccess={fetchClasses} // reload khi join thành công
        />
        <div
          className="page-content p-4"
          style={{
            flexGrow: 1,
            overflowY: "auto", // Cho phép phần nội dung cuộn
            height: "100%",
          }}
        >
          <ClassCardList data={classCards} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default GV_TeamClass;
