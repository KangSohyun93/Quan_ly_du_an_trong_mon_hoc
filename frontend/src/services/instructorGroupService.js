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

const fetchClassById = async (classId) => {
  try {
    const response = await fetch(`${API_URL}/classes/${classId}/groups`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchClassById:', error.message);
    throw error;
  }
};

const fetchGroupsByClassId = async (classId) => {
  try {
    const response = await fetch(`${API_URL}/classes/${classId}/groups`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API response for groups:', data);
    if (!Array.isArray(data)) {
      console.warn('Dữ liệu trả về từ API không phải là mảng:', data);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Error in fetchGroupsByClassId:', error.message);
    throw error;
  }
};

const fetchMembersByClassId = async (classId) => {
  try {
    const response = await fetch(`${API_URL}/classes/${classId}/members`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API response for members:', data);
    if (!Array.isArray(data)) {
      console.warn('Dữ liệu trả về từ API không phải là mảng:', data);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Error in fetchMembersByClassId:', error.message);
    throw error;
  }
};

export { fetchGroupsByInstructorId, fetchClassById, fetchGroupsByClassId, fetchMembersByClassId };