import React, { useEffect, useState } from "react";
import Sidebar from "../components/shared/Sidebar/Sidebar.js";
import JoinClassBar from "../components/classHeader/classHeader.js";
import ClassCardList from "../components/shared/ClassCard/classList.js";
import { SearchClass, getInfoClass } from "../services/class-service.js";

function SV_TeamClass() {
  const [searchText, setSearchText] = useState("");
  const [classCards, setClassCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      if (searchText.trim() !== "") {
        const searchResult = await SearchClass({ searchText });
        setClassCards(Array.isArray(searchResult) ? searchResult : []);
      } else {
        const allClasses = await getInfoClass();
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
      {/* <div style={{ flexShrink: 0 }}>
        <Sidebar />
      </div> */}
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

export default SV_TeamClass;
