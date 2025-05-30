import "./ClassTable.css"; // Đảm bảo bạn có file CSS tương ứng

const ClassTable = ({
  classes = [], // Mảng mặc định cho lớp học
  onEditClass,
  onDeleteClass,
  formatDate,
  loading,
}) => {
  const hasClasses = Array.isArray(classes) && classes.length > 0;

  if (loading && !hasClasses) {
    if (loading === "error") {
      return (
        <p className="error-text table-feedback">
          Có lỗi xảy ra khi tải danh sách lớp học.
        </p>
      );
    }
    return (
      <p className="loading-text table-feedback">
        Đang tải danh sách lớp học...
      </p>
    );
  }

  if (!loading && !hasClasses) {
    return (
      <p className="no-data-text table-feedback">Không tìm thấy lớp học nào.</p>
    );
  }

  return (
    <div className="class-table-container">
      <table>
        <thead>
          <tr>
            <th>ClassID</th>
            <th>ClassName</th>
            <th>Semester</th>
            <th>Created At</th>
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && hasClasses && (
            <tr>
              <td colSpan="6" className="loading-text table-feedback">
                Đang cập nhật...
              </td>
            </tr>
          )}
          {classes.map((cls) => (
            <tr key={cls.classId}>
              <td>{String(cls.classId).padStart(3, "0")}</td>
              <td>{cls.className}</td>
              <td>{cls.semester}</td>
              <td>{formatDate(cls.createdAt)}</td>
              <td>{cls.createdBy}</td>
              <td>
                <button
                  onClick={() => onEditClass(cls.class_id)}
                  className="action-icon edit-icon"
                  title="Edit Class"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDeleteClass(cls)}
                  className="action-icon delete-icon"
                  title="Delete Class"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassTable;
