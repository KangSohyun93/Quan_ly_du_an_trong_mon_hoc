// frontend/src/components/task/UserFilter.js
export const filterTasksByUser = (tasks, selectedUserId) => {
  if (!selectedUserId) {
    return tasks; // Nếu không chọn user, trả về tất cả task
  }
  return tasks.filter(task => task.assigned_to === selectedUserId);
};