import React from "react";
import { IoIosListBox } from "react-icons/io";
import "./import.css";
import { ImportClass } from "../../services/class-service";
import { useParams } from "react-router-dom";
const ImportHeader = () => {
  const { id } = useParams();
  const handleImport = async (event) => {
    event.preventDefault();
    try {
      const form = event.target;
      const formData = new FormData();
      formData.append("avatar", form.avatar.files[0]); // Sửa ở đây
      const data = await ImportClass(formData, id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form method="post" enctype="multipart/form-data" onSubmit={handleImport}>
      <label htmlFor="upload_file" className="import-container">
        <IoIosListBox className="import-icon" />
        <span className="import-label">Student list management</span>
      </label>
      <input type="file" name="avatar" id="upload_file" />
      <button>submit</button>
    </form>
  );
};
export default ImportHeader;
