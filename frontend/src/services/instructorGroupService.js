const API_URL = 'http://localhost:5000/api/instructor-groups';

const fetchGroupsByInstructorId = async (instructorId) => {
  try {
    const response = await fetch(`${API_URL}?instructor_id=${instructorId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      console.warn('Dữ liệu trả về từ API không phải là mảng:', data);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Error in fetchGroupsByInstructorId:', error.message);
    throw error;
  }
};

export { fetchGroupsByInstructorId };