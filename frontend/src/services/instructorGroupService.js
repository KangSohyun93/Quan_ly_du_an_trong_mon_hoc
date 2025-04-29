export const fetchClassesByInstructorId = async (instructorId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/instructor/classes/${instructorId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách lớp: ${error.message}`);
  }
};