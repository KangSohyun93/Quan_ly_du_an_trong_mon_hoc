import React, { useState } from "react";
import { IoIosListBox } from "react-icons/io";
import "./import.css";
import { ImportClass } from "../../services/class-service";

const ImportHeader = ({ classId }) => {
  const [fileName, setFileName] = useState("");

  const handleImport = async (event) => {
    event.preventDefault();
    try {
      const form = event.target;
      const formData = new FormData();
      formData.append("avatar", form.avatar.files[0]);
      const data = await ImportClass(formData, classId);
      alert("Import thành công!");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    setFileName(e.target.files[0]?.name || "");
  };

  // Hàm huỷ chọn file
  const handleCancel = () => {
    setFileName("");
    document.getElementById("upload_file").value = "";
  };

  return (
    <form
      className="import-form"
      method="post"
      encType="multipart/form-data"
      onSubmit={handleImport}
    >
      <label htmlFor="upload_file" className="import-container">
        <IoIosListBox className="import-icon" />
        <span className="import-label">Student list management</span>
      </label>
      <input
        type="file"
        name="avatar"
        id="upload_file"
        className="import-file-input"
        onChange={handleFileChange}
        accept=".xlsx,.xls,.csv"
      />
      <span className="import-file-name">{fileName}</span>
      <div className="import-actions">
        <button
          type="submit"
          className="import-submit-btn"
          disabled={!fileName}
        >
          Submit
        </button>
        <button
          type="button"
          className="import-cancel-btn"
          onClick={handleCancel}
          disabled={!fileName}
        >
          Huỷ
        </button>
      </div>
    </form>
  );
};

export default ImportHeader;
