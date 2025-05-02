-- Chèn dữ liệu vào bảng Users
INSERT INTO Users (username, email, password, role, is_active, avatar) VALUES
-- 30 sinh viên
('Student1', 'student1@example.com', 'hashed_password_1', 'Student', TRUE, '/uploads/student1.jpg'),
('Student2', 'student2@example.com', 'hashed_password_2', 'Student', TRUE, '/uploads/student2.jpg'),
('Student3', 'student3@example.com', 'hashed_password_3', 'Student', TRUE, '/uploads/student3.jpg'),
('Student4', 'student4@example.com', 'hashed_password_4', 'Student', TRUE, '/uploads/student4.jpg'),
('Student5', 'student5@example.com', 'hashed_password_5', 'Student', TRUE, '/uploads/student5.jpg'),
('Student6', 'student6@example.com', 'hashed_password_6', 'Student', TRUE, '/uploads/student6.jpg'),
('Student7', 'student7@example.com', 'hashed_password_7', 'Student', TRUE, '/uploads/student7.jpg'),
('Student8', 'student8@example.com', 'hashed_password_8', 'Student', TRUE, '/uploads/student8.jpg'),
('Student9', 'student9@example.com', 'hashed_password_9', 'Student', TRUE, '/uploads/student9.jpg'),
('Student10', 'student10@example.com', 'hashed_password_10', 'Student', TRUE, '/uploads/student10.jpg'),
('Student11', 'student11@example.com', 'hashed_password_11', 'Student', TRUE, '/uploads/student11.jpg'),
('Student12', 'student12@example.com', 'hashed_password_12', 'Student', TRUE, '/uploads/student12.jpg'),
('Student13', 'student13@example.com', 'hashed_password_13', 'Student', TRUE, '/uploads/student13.jpg'),
('Student14', 'student14@example.com', 'hashed_password_14', 'Student', TRUE, '/uploads/student14.jpg'),
('Student15', 'student15@example.com', 'hashed_password_15', 'Student', TRUE, '/uploads/student15.jpg'),
('Student16', 'student16@example.com', 'hashed_password_16', 'Student', TRUE, '/uploads/student16.jpg'),
('Student17', 'student17@example.com', 'hashed_password_17', 'Student', TRUE, '/uploads/student17.jpg'),
('Student18', 'student18@example.com', 'hashed_password_18', 'Student', TRUE, '/uploads/student18.jpg'),
('Student19', 'student19@example.com', 'hashed_password_19', 'Student', TRUE, '/uploads/student19.jpg'),
('Student20', 'student20@example.com', 'hashed_password_20', 'Student', TRUE, '/uploads/student20.jpg'),
('Student21', 'student21@example.com', 'hashed_password_21', 'Student', TRUE, '/uploads/student21.jpg'),
('Student22', 'student22@example.com', 'hashed_password_22', 'Student', TRUE, '/uploads/student22.jpg'),
('Student23', 'student23@example.com', 'hashed_password_23', 'Student', TRUE, '/uploads/student23.jpg'),
('Student24', 'student24@example.com', 'hashed_password_24', 'Student', TRUE, '/uploads/student24.jpg'),
('Student25', 'student25@example.com', 'hashed_password_25', 'Student', TRUE, '/uploads/student25.jpg'),
('Student26', 'student26@example.com', 'hashed_password_26', 'Student', TRUE, '/uploads/student26.jpg'),
('Student27', 'student27@example.com', 'hashed_password_27', 'Student', TRUE, '/uploads/student27.jpg'),
('Student28', 'student28@example.com', 'hashed_password_28', 'Student', TRUE, '/uploads/student28.jpg'),
('Student29', 'student29@example.com', 'hashed_password_29', 'Student', TRUE, '/uploads/student29.jpg'),
('Student30', 'student30@example.com', 'hashed_password_30', 'Student', TRUE, '/uploads/student30.jpg'),
-- 3 giảng viên
('ProfSmith', 'smith@example.com', 'hashed_password_31', 'Instructor', TRUE, '/uploads/smith.jpg'),
('ProfJones', 'jones@example.com', 'hashed_password_32', 'Instructor', TRUE, '/uploads/jones.jpg'),
('ProfBrown', 'brown@example.com', 'hashed_password_33', 'Instructor', TRUE, '/uploads/brown.jpg'),
-- 1 quản trị viên
('Admin1', 'admin1@example.com', 'hashed_password_34', 'Admin', TRUE, '/uploads/admin1.jpg');

-- Chèn dữ liệu vào bảng Classes
INSERT INTO Classes (class_id, class_name, instructor_id, semester, secret_code) VALUES 
(100001, 'Công nghệ phần mềm', 31, '2025.1', 'SE2025'), -- ProfSmith
(100002, 'Lập trình web', 32, '2025.1', 'WEB2025'), -- ProfJones
(100003, 'Cấu trúc dữ liệu', 33, '2025.2', 'DS2025'), -- ProfBrown
(100004, 'Hệ điều hành', 31, '2025.2', 'OS2025'), -- ProfSmith
(100005, 'Trí tuệ nhân tạo', 32, '2025.2', 'AI2025'); -- ProfJones

-- Chèn dữ liệu vào bảng Groups
-- Không chèn group_number vì trigger before_group_insert sẽ tự động gán
INSERT INTO Groups (group_name, class_id, leader_id) VALUES
('Nhóm 1', 100001, 1),  -- Student1, class Công nghệ phần mềm
('Nhóm 2', 100001, 5),  -- Student5, class Công nghệ phần mềm
('Nhóm 3', 100002, 7),  -- Student7, class Lập trình web
('Nhóm 4', 100002, 11), -- Student11, class Lập trình web
('Nhóm 5', 100003, 13), -- Student13, class Cấu trúc dữ liệu
('Nhóm 6', 100003, 17), -- Student17, class Cấu trúc dữ liệu
('Nhóm 7', 100004, 19), -- Student19, class Hệ điều hành
('Nhóm 8', 100004, 23), -- Student23, class Hệ điều hành
('Nhóm 9', 100005, 25), -- Student25, class Trí tuệ nhân tạo
('Nhóm 10', 100005, 29); -- Student29, class Trí tuệ nhân tạo

-- Chèn dữ liệu vào bảng GroupMembers
-- Đảm bảo mỗi sinh viên chỉ tham gia 1 nhóm trong mỗi lớp
INSERT INTO GroupMembers (group_id, user_id) VALUES
-- Nhóm 1 (class 100001): Student1 (PM), Student2, Student3, Student4
(1, 1), (1, 2), (1, 3), (1, 4),
-- Nhóm 2 (class 100001): Student5 (PM), Student6, Student7, Student8
(2, 5), (2, 6), (2, 7), (2, 8),
-- Nhóm 3 (class 100002): Student7 (PM), Student8, Student9, Student10
(3, 7), (3, 8), (3, 9), (3, 10),
-- Nhóm 4 (class 100002): Student11 (PM), Student12, Student13, Student14
(4, 11), (4, 12), (4, 13), (4, 14),
-- Nhóm 5 (class 100003): Student13 (PM), Student14, Student15, Student16
(5, 13), (5, 14), (5, 15), (5, 16),
-- Nhóm 6 (class 100003): Student17 (PM), Student18, Student19, Student20
(6, 17), (6, 18), (6, 19), (6, 20),
-- Nhóm 7 (class 100004): Student19 (PM), Student20, Student21, Student22
(7, 19), (7, 20), (7, 21), (7, 22),
-- Nhóm 8 (class 100004): Student23 (PM), Student24, Student25, Student26
(8, 23), (8, 24), (8, 25), (8, 26),
-- Nhóm 9 (class 100005): Student25 (PM), Student26, Student27, Student28
(9, 25), (9, 26), (9, 27), (9, 28),
-- Nhóm 10 (class 100005): Student29 (PM), Student30, Student1, Student2
(10, 29), (10, 30), (10, 1), (10, 2);

-- Chèn dữ liệu vào bảng Projects
INSERT INTO Projects (project_name, group_id, description, tools_used, status, github_repo_url) VALUES
('Hệ thống quản lý thư viện', 1, 'Xây dựng hệ thống quản lý thư viện trực tuyến', 'React, Node.js, MySQL', 'Ongoing', 'https://github.com/group1/library-system'),
('Ứng dụng đặt vé xem phim', 2, 'Ứng dụng đặt vé xem phim trên mobile', 'Flutter, Firebase', 'Completed', 'https://github.com/group2/movie-ticket'),
('Website bán hàng', 3, 'Website thương mại điện tử bán hàng', 'Vue.js, Express, MongoDB', 'Ongoing', 'https://github.com/group3/ecommerce'),
('Ứng dụng ghi chú', 4, 'Ứng dụng ghi chú đơn giản', 'React Native, SQLite', 'Cancelled', 'https://github.com/group4/notes-app'),
('Phân tích dữ liệu sinh viên', 5, 'Phân tích dữ liệu sinh viên bằng Python', 'Python, Pandas, Matplotlib', 'Ongoing', 'https://github.com/group5/student-analysis'),
('Hệ thống quản lý kho', 6, 'Hệ thống quản lý kho hàng', 'Angular, Spring Boot, PostgreSQL', 'Ongoing', 'https://github.com/group6/inventory-system'),
('Ứng dụng học tập', 7, 'Ứng dụng hỗ trợ học tập', 'React, Django, SQLite', 'Completed', 'https://github.com/group7/learning-app'),
('Hệ điều hành mini', 8, 'Xây dựng hệ điều hành mini', 'C, Assembly', 'Ongoing', 'https://github.com/group8/mini-os'),
('AI nhận diện hình ảnh', 9, 'Ứng dụng AI nhận diện hình ảnh', 'Python, TensorFlow, OpenCV', 'Ongoing', 'https://github.com/group9/image-recognition'),
('Chatbot thông minh', 10, 'Xây dựng chatbot thông minh', 'Python, Flask, NLTK', 'Ongoing', 'https://github.com/group10/smart-chatbot');
-- Chèn dữ liệu vào bảng Sprints
-- Mỗi project có 2 sprint
INSERT INTO Sprints (project_id, sprint_name, start_date, end_date) VALUES
-- Project 1: Hệ thống quản lý thư viện
(1, 'Sprint 1 - Giai đoạn thiết kế', '2025-03-01', '2025-03-15'),
(1, 'Sprint 2 - Giai đoạn phát triển', '2025-03-16', '2025-03-30'),
-- Project 2: Ứng dụng đặt vé xem phim
(2, 'Sprint 1 - Giai đoạn khởi tạo', '2025-02-01', '2025-02-15'),
(2, 'Sprint 2 - Giai đoạn hoàn thiện', '2025-02-16', '2025-03-01'),
-- Project 3: Website bán hàng
(3, 'Sprint 1 - Giai đoạn giao diện', '2025-03-01', '2025-03-15'),
(3, 'Sprint 2 - Giai đoạn chức năng', '2025-03-16', '2025-03-30'),
-- Project 4: Ứng dụng ghi chú
(4, 'Sprint 1 - Giai đoạn thiết kế', '2025-02-01', '2025-02-15'),
(4, 'Sprint 2 - Giai đoạn phát triển', '2025-02-16', '2025-03-01'),
-- Project 5: Phân tích dữ liệu sinh viên
(5, 'Sprint 1 - Giai đoạn thu thập', '2025-03-01', '2025-03-15'),
(5, 'Sprint 2 - Giai đoạn phân tích', '2025-03-16', '2025-03-30'),
-- Project 6: Hệ thống quản lý kho
(6, 'Sprint 1 - Giai đoạn thiết kế', '2025-03-01', '2025-03-15'),
(6, 'Sprint 2 - Giai đoạn phát triển', '2025-03-16', '2025-03-30'),
-- Project 7: Ứng dụng học tập
(7, 'Sprint 1 - Giai đoạn khởi tạo', '2025-02-01', '2025-02-15'),
(7, 'Sprint 2 - Giai đoạn hoàn thiện', '2025-02-16', '2025-03-01'),
-- Project 8: Hệ điều hành mini
(8, 'Sprint 1 - Giai đoạn khởi tạo', '2025-03-01', '2025-03-15'),
(8, 'Sprint 2 - Giai đoạn phát triển', '2025-03-16', '2025-03-30'),
-- Project 9: AI nhận diện hình ảnh
(9, 'Sprint 1 - Giai đoạn thu thập dữ liệu', '2025-03-01', '2025-03-15'),
(9, 'Sprint 2 - Giai đoạn huấn luyện', '2025-03-16', '2025-03-30'),
-- Project 10: Chatbot thông minh
(10, 'Sprint 1 - Giai đoạn thiết kế', '2025-03-01', '2025-03-15'),
(10, 'Sprint 2 - Giai đoạn phát triển', '2025-03-16', '2025-03-30');

-- Chèn dữ liệu vào bảng Tasks
INSERT INTO Tasks (sprint_id, title, description, assigned_to, status, due_date, completed_at, progress_percentage) VALUES
-- Dự án 1: Hệ thống quản lý thư viện (Sprint 1: Done tasks, Sprint 2: In-Progress/To-Do)
(1, 'Thiết kế giao diện', 'Thiết kế giao diện người dùng', 1, 'Completed', '2025-04-10 23:59:00', '2025-04-09 10:00:00', 100),
(2, 'Xây dựng API', 'Xây dựng API cho hệ thống', 2, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
(2, 'Kiểm thử hệ thống', 'Kiểm thử các chức năng', 3, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
(1, 'Tài liệu', 'Viết tài liệu', 4, 'Completed', '2025-04-10 23:59:00', '2025-04-09 10:00:00', 100),
(1, 'Cải thiện hiệu suất', 'Tối ưu hiệu suất', 1, 'Completed', '2025-04-10 23:59:00', '2025-04-09 10:00:00', 100),
-- Dự án 2: Ứng dụng đặt vé xem phim (Sprint 3: Done tasks, Sprint 4: None)
(3, 'Cơ sở dữ liệu', 'Thiết kế CSDL cho ứng dụng', 5, 'Completed', '2025-03-20 23:59:00', '2025-03-21 10:00:00', 100),
(3, 'Giao diện đặt vé', 'Thiết kế giao diện đặt vé', 6, 'Completed', '2025-03-25 23:59:00', '2025-03-24 10:00:00', 100),
(3, 'Tích hợp thanh toán', 'Tích hợp cổng thanh toán', 7, 'Completed', '2025-03-30 23:59:00', '2025-03-29 10:00:00', 100),
(3, 'Kiểm thử', 'Kiểm thử ứng dụng', 8, 'Completed', '2025-03-30 23:59:00', '2025-03-29 10:00:00', 100),
(3, 'Triển khai', 'Triển khai ứng dụng', 5, 'Completed', '2025-03-30 23:59:00', '2025-03-29 10:00:00', 100),
-- Dự án 3: Website bán hàng (Sprint 5: None, Sprint 6: In-Progress/To-Do)
(6, 'Trang chủ', 'Thiết kế trang chủ', 7, 'In-Progress', '2025-04-15 23:59:00', NULL, 33),
(6, 'Giỏ hàng', 'Chức năng giỏ hàng', 8, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
(6, 'Thanh toán', 'Chức năng thanh toán', 9, 'To-Do', '2025-04-25 23:59:00', NULL, 0),
(6, 'Quản lý sản phẩm', 'Chức năng quản lý sản phẩm', 10, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
(6, 'Tìm kiếm', 'Chức năng tìm kiếm sản phẩm', 7, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
-- Dự án 4: Ứng dụng ghi chú (Sprint 7: Done tasks, Sprint 8: To-Do)
(7, 'Giao diện chính', 'Thiết kế giao diện chính', 11, 'Completed', '2025-03-10 23:59:00', '2025-03-09 10:00:00', 100),
(7, 'Lưu trữ ghi chú', 'Chức năng lưu trữ ghi chú', 12, 'Completed', '2025-03-15 23:59:00', '2025-03-14 10:00:00', 100),
(8, 'Đồng bộ hóa', 'Đồng bộ hóa với cloud', 13, 'To-Do', '2025-03-20 23:59:00', NULL, 0),
(7, 'Giao diện phụ', 'Thiết kế giao diện phụ', 14, 'Completed', '2025-03-10 23:59:00', '2025-03-09 10:00:00', 100),
(7, 'Kiểm thử', 'Kiểm thử ứng dụng', 11, 'Completed', '2025-03-15 23:59:00', '2025-03-14 10:00:00', 100),
-- Dự án 5: Phân tích dữ liệu sinh viên (Sprint 9: Done tasks, Sprint 10: In-Progress/To-Do)
(9, 'Thu thập dữ liệu', 'Thu thập dữ liệu sinh viên', 13, 'Completed', '2025-04-05 23:59:00', '2025-04-04 10:00:00', 100),
(10, 'Phân tích dữ liệu', 'Phân tích dữ liệu bằng Python', 14, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
(10, 'Báo cáo', 'Viết báo cáo phân tích', 15, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
(10, 'Trực quan hóa', 'Trực quan hóa dữ liệu', 16, 'To-Do', '2025-04-25 23:59:00', NULL, 0),
(10, 'Kiểm thử', 'Kiểm thử phân tích', 13, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
-- Dự án 6: Hệ thống quản lý kho (Sprint 11: Done tasks, Sprint 12: In-Progress/To-Do)
(11, 'Thiết kế CSDL', 'Thiết kế cơ sở dữ liệu', 17, 'Completed', '2025-04-05 23:59:00', '2025-04-04 10:00:00', 100),
(12, 'Giao diện nhập kho', 'Thiết kế giao diện nhập kho', 18, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
(12, 'Giao diện xuất kho', 'Thiết kế giao diện xuất kho', 19, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
(12, 'Báo cáo kho', 'Chức năng báo cáo kho', 20, 'To-Do', '2025-04-25 23:59:00', NULL, 0),
(12, 'Tích hợp API', 'Tích hợp API quản lý kho', 17, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
-- Dự án 7: Ứng dụng học tập (Sprint 13: Done tasks, Sprint 14: None)
(13, 'Giao diện chính', 'Thiết kế giao diện chính', 19, 'Completed', '2025-03-10 23:59:00', '2025-03-09 10:00:00', 100),
(13, 'Quản lý bài học', 'Chức năng quản lý bài học', 20, 'Completed', '2025-03-15 23:59:00', '2025-03-14 10:00:00', 100),
(13, 'Kiểm tra', 'Chức năng kiểm tra', 21, 'Completed', '2025-03-20 23:59:00', '2025-03-19 10:00:00', 100),
(13, 'Thống kê', 'Chức năng thống kê tiến độ', 22, 'Completed', '2025-03-20 23:59:00', '2025-03-19 10:00:00', 100),
(13, 'Triển khai', 'Triển khai ứng dụng', 19, 'Completed', '2025-03-20 23:59:00', '2025-03-19 10:00:00', 100),
-- Dự án 8: Hệ điều hành mini (Sprint 15: None, Sprint 16: In-Progress/To-Do)
(16, 'Khởi tạo hệ thống', 'Khởi tạo hệ thống cơ bản', 23, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
(16, 'Quản lý bộ nhớ', 'Chức năng quản lý bộ nhớ', 24, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
(16, 'Quản lý tiến trình', 'Chức năng quản lý tiến trình', 25, 'To-Do', '2025-04-25 23:59:00', NULL, 0),
(16, 'Hệ thống file', 'Chức năng hệ thống file', 26, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
(16, 'Kiểm thử', 'Kiểm thử hệ thống', 23, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
-- Dự án 9: AI nhận diện hình ảnh (Sprint 17: Done tasks, Sprint 18: In-Progress/To-Do)
(17, 'Thu thập dữ liệu', 'Thu thập dữ liệu hình ảnh', 25, 'Completed', '2025-04-05 23:59:00', '2025-04-04 10:00:00', 100),
(18, 'Huấn luyện mô hình', 'Huấn luyện mô hình AI', 26, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
(18, 'Kiểm thử mô hình', 'Kiểm thử mô hình AI', 27, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
(18, 'Triển khai API', 'Triển khai API nhận diện', 28, 'To-Do', '2025-04-25 23:59:00', NULL, 0),
(18, 'Tài liệu', 'Viết tài liệu', 25, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
-- Dự án 10: Chatbot thông minh (Sprint 19: Done tasks, Sprint 20: In-Progress/To-Do)
(19, 'Thiết kế giao diện', 'Thiết kế giao diện chatbot', 29, 'Completed', '2025-04-05 23:59:00', '2025-04-04 10:00:00', 100),
(20, 'Xử lý ngôn ngữ', 'Chức năng xử lý ngôn ngữ', 30, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
(20, 'Tích hợp API', 'Tích hợp API chatbot', 1, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
(20, 'Kiểm thử', 'Kiểm thử chatbot', 2, 'To-Do', '2025-04-25 23:59:00', NULL, 0),
(20, 'Triển khai', 'Triển khai chatbot', 29, 'In-Progress', '2025-04-15 23:59:00', NULL, 50);

-- Chèn dữ liệu vào bảng TaskChecklists
INSERT INTO TaskChecklists (task_id, item_description, is_completed) VALUES
-- Task 1 (Thiết kế giao diện, Done)
(1, 'Thiết kế trang chủ', TRUE),
(1, 'Thiết kế trang đăng nhập', TRUE),
(1, 'Thiết kế trang quản lý', TRUE),
-- Task 2 (Xây dựng API, In-Progress)
(2, 'API đăng nhập', TRUE),
(2, 'API quản lý sách', FALSE),
(2, 'API tìm kiếm', FALSE),
-- Task 11 (Trang chủ, In-Progress)
(11, 'Header', TRUE),
(11, 'Footer', FALSE),
(11, 'Slider', FALSE),
-- Task 16 (Giao diện chính, Done)
(16, 'Thiết kế giao diện chính', TRUE),
(16, 'Thiết kế menu', TRUE);

-- Chèn dữ liệu vào bảng TaskComments
INSERT INTO TaskComments (task_id, user_id, comment_text) VALUES
(1, 2, 'Giao diện đẹp nhưng cần thêm màu sắc tươi sáng hơn.'),
(1, 3, 'Đã kiểm tra, giao diện hoạt động tốt.'),
(2, 1, 'API đăng nhập đã xong, đang làm API quản lý sách.'),
(11, 8, 'Header đã hoàn thành, cần thêm slider.');

-- Chèn dữ liệu vào bảng GitContributions
INSERT INTO GitContributions (project_id, user_id, commit_hash, commit_message, lines_added, lines_removed, commit_date) VALUES
(1, 1, 'a1b2c3d4e5f6g7h8i9j0', 'Thêm giao diện trang chủ', 150, 20, '2025-04-09 10:00:00'),
(1, 2, 'b2c3d4e5f6g7h8i9j0k1', 'Thêm API đăng nhập', 100, 10, '2025-04-10 12:00:00'),
(2, 5, 'c3d4e5f6g7h8i9j0k1l2', 'Thiết kế CSDL', 80, 5, '2025-03-21 10:00:00'),
(3, 7, 'd4e5f6g7h8i9j0k1l2m3', 'Thêm giao diện trang chủ', 200, 30, '2025-04-10 15:00:00'),
(5, 13, 'e5f6g7h8i9j0k1l2m3n4', 'Thu thập dữ liệu sinh viên', 120, 15, '2025-04-04 10:00:00');

-- Chèn dữ liệu vào bảng PeerAssessments
INSERT INTO PeerAssessments (group_id, assessor_id, assessee_id, deadline_score, friendly_score, quality_score, team_support_score, responsibility_score, note) VALUES
-- Nhóm 1
(1, 2, 1, 5, 5, 4, 4, 5, 'Hoàn thành công việc đúng hạn và hỗ trợ nhóm tốt.'),
(1, 3, 1, 4, 5, 4, 5, 4, 'Cần cải thiện tốc độ hoàn thành nhiệm vụ.'),
(1, 1, 2, 5, 4, 5, 4, 5, 'Chất lượng công việc tốt, cần thân thiện hơn.'),
-- Nhóm 2
(2, 6, 5, 5, 5, 5, 4, 5, 'Thành viên xuất sắc, hỗ trợ nhóm rất tốt.'),
(2, 7, 5, 4, 5, 4, 5, 4, 'Cần chú ý hơn đến chất lượng công việc.'),
-- Nhóm 3
(3, 8, 7, 5, 4, 5, 4, 5, 'Đúng hạn và có trách nhiệm cao.'),
(3, 9, 7, 4, 5, 4, 5, 4, 'Thân thiện nhưng cần cải thiện chất lượng.'),
-- Nhóm 4
(4, 12, 11, 5, 5, 4, 4, 5, 'Hỗ trợ nhóm tốt, công việc chất lượng.'),
(4, 13, 11, 4, 5, 5, 4, 4, 'Cần chú ý hơn đến việc đúng hạn.'),
-- Nhóm 5
(5, 14, 13, 5, 4, 5, 5, 4, 'Chất lượng công việc tốt, cần thân thiện hơn.'),
(5, 15, 13, 4, 5, 4, 5, 5, 'Hỗ trợ nhóm tốt, cần cải thiện deadline.'),
-- Nhóm 6
(6, 18, 17, 5, 5, 4, 4, 5, 'Thành viên trách nhiệm, đúng hạn.'),
(6, 19, 17, 4, 5, 5, 4, 4, 'Chất lượng tốt nhưng cần hỗ trợ nhóm nhiều hơn.'),
-- Nhóm 7
(7, 20, 19, 5, 4, 5, 5, 4, 'Hỗ trợ nhóm tốt, chất lượng cao.'),
(7, 21, 19, 4, 5, 4, 5, 5, 'Thân thiện, cần chú ý đến deadline.'),
-- Nhóm 8
(8, 24, 23, 5, 5, 4, 4, 5, 'Hoàn thành công việc đúng hạn, hỗ trợ tốt.'),
(8, 25, 23, 4, 5, 5, 4, 4, 'Chất lượng tốt, cần cải thiện trách nhiệm.'),
-- Nhóm 9
(9, 26, 25, 5, 4, 5, 5, 4, 'Chất lượng công việc tốt, cần thân thiện hơn.'),
(9, 27, 25, 4, 5, 4, 5, 5, 'Hỗ trợ nhóm tốt, cần đúng hạn hơn.'),
-- Nhóm 10
(10, 30, 29, 5, 5, 4, 4, 5, 'Thành viên xuất sắc, hỗ trợ nhóm tốt.'),
(10, 1, 29, 4, 5, 5, 4, 4, 'Chất lượng tốt, cần cải thiện deadline.');

-- Chèn dữ liệu vào bảng InstructorEvaluations
INSERT INTO InstructorEvaluations (group_id, user_id, instructor_id, score, comments) VALUES
(1, 1, 31, 8, 'Làm việc tốt, cần cải thiện giao tiếp.'),
(1, 2, 31, 7, 'Hoàn thành công việc đúng hạn.'),
(2, 5, 31, 9, 'Nhóm trưởng xuất sắc.'),
(3, 7, 32, 8, 'Làm việc chăm chỉ.'),
(4, 11, 32, 7, 'Cần cải thiện kỹ năng quản lý thời gian.'),
(5, 13, 33, 9, 'Công việc chất lượng cao.'),
(6, 17, 33, 8, 'Hỗ trợ nhóm tốt.'),
(7, 19, 31, 7, 'Cần chú ý đến chi tiết hơn.'),
(8, 23, 31, 8, 'Làm việc nhóm tốt.'),
(9, 25, 32, 9, 'Hoàn thành công việc xuất sắc.'),
(10, 29, 32, 8, 'Tích cực trong dự án.');

-- Chèn dữ liệu vào bảng SystemConfigurations
INSERT INTO SystemConfigurations (config_key, config_value, description, updated_by) VALUES
('max_group_size', '5', 'Số thành viên tối đa trong một nhóm', 34),
('task_deadline_reminder', '2', 'Số ngày trước hạn để gửi nhắc nhở', 34),
('peer_assessment_deadline', '2025-05-01', 'Hạn chót đánh giá ngang hàng', 34);

-- Chèn dữ liệu vào bảng PasswordResetTokens
INSERT INTO PasswordResetTokens (user_id, token, expires_at) VALUES
(1, 'token_123', '2025-04-24 23:59:00'),
(5, 'token_456', '2025-04-24 23:59:00'),
(7, 'token_789', '2025-04-24 23:59:00');