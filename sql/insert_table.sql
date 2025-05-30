-- Chèn dữ liệu vào bảng Users
INSERT INTO Users (username, email, password, role, github_email, github_username, is_active, avatar) VALUES
-- 30 sinh viên
('Nguyễn Ngọc Lan', 'student1@example.com', 'hashed_password_1', 'Student', 'ngoclan271204@gmail.com', 'NgLan', TRUE, '/uploads/student1.jpg'),
('Hoàng Hương Giang', 'student2@example.com', 'hashed_password_2', 'Student', 'Riechanbaka@gmail.com', 'GiangClaude', TRUE, '/uploads/student2.jpg'),
('Bùi Thu Trang', 'student3@example.com', 'hashed_password_3', 'Student', 'soratrang31294@gmail.com', 'btttrangcfm09', TRUE, '/uploads/student3.jpg'),
('Nguyễn Thị Nhung', 'student4@example.com', 'hashed_password_4', 'Student', 'nguyenthinhung29022004@gmail.com', 'KangSohyun93', TRUE, '/uploads/student4.jpg'),
('Thân Cát Ngọc Lan', 'student5@example.com', 'hashed_password_5', 'Student', 'chantran29102004@gmail.com', 'KattoRan', TRUE, '/uploads/student5.jpg'),
('Trần Thị Vân Anh', 'student6@example.com', 'hashed_password_6', 'Student', 'khuctieuho@gmail.com', 'tranvananhanhanh', TRUE, '/uploads/student6.jpg'),
('Bùi Thị Xuân', 'student7@example.com', 'hashed_password_7', 'Student', 'Xuan.BT225957@sis.hust.edu.vn', 'nospring2902', TRUE, '/uploads/student7.jpg'),
('Nguyễn Thị Huyền Trang', 'student8@example.com', 'hashed_password_8', 'Student', 'nthtrang2004@gmail.com', 'HuyenTranggg', TRUE, '/uploads/student8.jpg'),
('Student9', 'student9@example.com', 'hashed_password_9', 'Student', 'student9@gmail.com', 'student9', TRUE, '/uploads/student9.jpg'),
('Student10', 'student10@example.com', 'hashed_password_10', 'Student', 'student10@gmail.com', 'student10', TRUE, '/uploads/student10.jpg'),
('Student11', 'student11@example.com', 'hashed_password_11', 'Student', 'student11@gmail.com', 'student11', TRUE, '/uploads/student11.jpg'),
('Student12', 'student12@example.com', 'hashed_password_12', 'Student', 'student12@gmail.com', 'student12', TRUE, '/uploads/student12.jpg'),
('Student13', 'student13@example.com', 'hashed_password_13', 'Student', 'student13@gmail.com', 'student13', TRUE, '/uploads/student13.jpg'),
('Student14', 'student14@example.com', 'hashed_password_14', 'Student', 'student14@gmail.com', 'student14', TRUE, '/uploads/student14.jpg'),
('Student15', 'student15@example.com', 'hashed_password_15', 'Student', 'student15@gmail.com', 'student15', TRUE, '/uploads/student15.jpg'),
('Student16', 'student16@example.com', 'hashed_password_16', 'Student', 'student16@gmail.com', 'student16', TRUE, '/uploads/student16.jpg'),
('Student17', 'student17@example.com', 'hashed_password_17', 'Student', 'student17@gmail.com', 'student17', TRUE, '/uploads/student17.jpg'),
('Student18', 'student18@example.com', 'hashed_password_18', 'Student', 'student18@gmail.com', 'student18', TRUE, '/uploads/student18.jpg'),
('Student19', 'student19@example.com', 'hashed_password_19', 'Student', 'student19@gmail.com', 'student19', TRUE, '/uploads/student19.jpg'),
('Student20', 'student20@example.com', 'hashed_password_20', 'Student', 'student20@gmail.com', 'student20', TRUE, '/uploads/student20.jpg'),
('Student21', 'student21@example.com', 'hashed_password_21', 'Student', 'student21@gmail.com', 'student21', TRUE, '/uploads/student21.jpg'),
('Student22', 'student22@example.com', 'hashed_password_22', 'Student', 'student22@gmail.com', 'student22', TRUE, '/uploads/student22.jpg'),
('Student23', 'student23@example.com', 'hashed_password_23', 'Student', 'student23@gmail.com', 'student23', TRUE, '/uploads/student23.jpg'),
('Student24', 'student24@example.com', 'hashed_password_24', 'Student', 'student24@gmail.com', 'student24', TRUE, '/uploads/student24.jpg'),
('Student25', 'student25@example.com', 'hashed_password_25', 'Student', 'student25@gmail.com', 'student25', TRUE, '/uploads/student25.jpg'),
('Student26', 'student26@example.com', 'hashed_password_26', 'Student', 'student26@gmail.com', 'student26', TRUE, '/uploads/student26.jpg'),
('Student27', 'student27@example.com', 'hashed_password_27', 'Student', 'student27@gmail.com', 'student27', TRUE, '/uploads/student27.jpg'),
('Student28', 'student28@example.com', 'hashed_password_28', 'Student', 'student28@gmail.com', 'student28', TRUE, '/uploads/student28.jpg'),
('Student29', 'student29@example.com', 'hashed_password_29', 'Student', 'student29@gmail.com', 'student29', TRUE, '/uploads/student29.jpg'),
('Student30', 'student30@example.com', 'hashed_password_30', 'Student', 'student30@gmail.com', 'student30', TRUE, '/uploads/student30.jpg'),
-- 3 giảng viên
('ProfSmith', 'smith@example.com', 'hashed_password_31', 'Instructor', 'smith@example.com', 'ProfSmith', TRUE, '/uploads/smith.jpg'),
('ProfJones', 'jones@example.com', 'hashed_password_32', 'Instructor', 'jones@example.com', 'ProfJones', TRUE, '/uploads/jones.jpg'),
('ProfBrown', 'brown@example.com', 'hashed_password_33', 'Instructor', 'brown@example.com', 'ProfBrown', TRUE, '/uploads/brown.jpg'),
-- 1 quản trị viên
('Admin1', 'admin1@example.com', 'hashed_password_34', 'Admin', '', '', TRUE, '/uploads/admin1.jpg');

-- Chèn dữ liệu vào bảng Classes
INSERT INTO Classes (class_id, class_name, instructor_id, semester, secret_code) VALUES 
(100001, 'ITSS', 31, '2025.1', 'SE2025'), -- ProfSmith
(100002, 'Kỹ thuật phần mềm', 32, '2025.1', 'WEB2025'), -- ProfJones
(100003, 'Cấu trúc dữ liệu', 33, '2025.2', 'DS2025'), -- ProfBrown
(100004, 'Hệ điều hành', 31, '2025.2', 'OS2025'), -- ProfSmith
(100005, 'Trí tuệ nhân tạo', 32, '2025.2', 'AI2025'); -- ProfJones

-- Chèn dữ liệu vào bảng `Groups`
-- Không chèn group_number vì trigger before_group_insert sẽ tự động gán
INSERT INTO `Groups` (group_name, class_id, leader_id) VALUES
('Nhóm 1', 100001, 4),  -- Student1, class ITSS
('Nhóm 2', 100001, 6),  -- Student5, class ITSS
('Nhóm 3', 100002, 6),  -- Student7, class Kỹ thuật phần mềm
('Nhóm 4', 100002, 11), -- Student11, class Lập trình web
('Nhóm 5', 100003, 13), -- Student13, class Cấu trúc dữ liệu
('Nhóm 6', 100003, 17), -- Student17, class Cấu trúc dữ liệu
('Nhóm 7', 100004, 19), -- Student19, class Hệ điều hành
('Nhóm 8', 100004, 23), -- Student23, class Hệ điều hành
('Nhóm 9', 100005, 25), -- Student25, class Trí tuệ nhân tạo
('Nhóm 10', 100005, 29); -- Student29, class Trí tuệ nhân tạo

-- Chèn dữ liệu vào bảng ClassMembers
-- Gán tất cả sinh viên vào các lớp dựa trên nhóm hoặc lớp tương ứng
INSERT INTO ClassMembers (class_id, user_id) VALUES
-- Lớp 100001 (ITSS): Student1-8 (đã có nhóm), Student9-10 (chưa có nhóm)
(100001, 1), (100001, 2), (100001, 3), (100001, 4), (100001, 5), (100001, 6), (100001, 7), (100001, 8), (100001, 9), (100001, 10),
-- Lớp 100002 (Kỹ th uật phần mềm): Student7-14 (đã có nhóm), Student15-16 (chưa có nhóm)
(100002, 1), (100002, 2), (100002, 4), (100002, 6), (100002, 7), (100002, 8), (100002, 9), (100002, 10), (100002, 11), (100002, 12), (100002, 13), (100002, 14), (100002, 15), (100002, 16),
-- Lớp 100003 (Cấu trúc dữ liệu): Student13-20 (đã có nhóm), Student21-22 (chưa có nhóm)
(100003, 13), (100003, 14), (100003, 15), (100003, 16), (100003, 17), (100003, 18), (100003, 19), (100003, 20), (100003, 21), (100003, 22),
-- Lớp 100004 (Hệ điều hành): Student19-26 (đã có nhóm), Student27-28 (chưa có nhóm)
(100004, 19), (100004, 20), (100004, 21), (100004, 22), (100004, 23), (100004, 24), (100004, 25), (100004, 26), (100004, 27), (100004, 28),
-- Lớp 100005 (Trí tuệ nhân tạo): Student25-30 (đã có nhóm), Student1-2 (trùng từ lớp khác, bỏ)
(100005, 25), (100005, 26), (100005, 27), (100005, 28), (100005, 29), (100005, 30);

-- Chèn dữ liệu vào bảng GroupMembers
-- Đảm bảo mỗi sinh viên chỉ tham gia 1 nhóm trong mỗi lớp
INSERT INTO GroupMembers (group_id, user_id) VALUES
-- Nhóm 1 (class 100001): Student1 (PM), Student2, Student3, Student4
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
-- Nhóm 2 (class 100001): Student5 (PM), Student6, Student7, Student8
(2, 6), (2, 7), (2, 8),
-- Nhóm 3 (class 100002): Student7 (PM), Student8, Student9, Student10
(3, 1), (3, 2), (3, 4), (3, 6), (3, 7), (3, 8), 
-- Nhóm 4 (class 100002): Student11 (PM), Student12, Student13, Student14
(4, 9), (4, 10), (4, 11), (4, 12), (4, 13), (4, 14),
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
('WorkTrace', 1, 'Trang web quản lý dự án của sinh viên trong 1 môn học', 'ReactJS, HTML, CSS, JavaScript, NodeJS, MySQL', 'Ongoing', 'https://github.com/KangSohyun93/Quan_ly_du_an_trong_mon_hoc'),
('Website bán hàng', 2, 'Website thương mại điện tử bán hàng', 'Vue.js, Express, MongoDB', 'Ongoing', 'https://github.com/group3/ecommerce'),
('CookHub', 3, 'Trang web chia sẻ công thức nấu ăn', 'HTML, CSS, JavaScript, Node.js, PostgreSQL', 'Completed', 'https://github.com/tranvananhanhanh/CookHub_Web'),
('Ứng dụng ghi chú', 4, 'Ứng dụng ghi chú đơn giản', 'React Native, SQLite', 'Cancelled', 'https://github.com/group4/notes-app'),
('Phân tích dữ liệu sinh viên', 5, 'Phân tích dữ liệu sinh viên bằng Python', 'Python, Pandas, Matplotlib', 'Ongoing', 'https://github.com/group5/student-analysis'),
('Hệ thống quản lý kho', 6, 'Hệ thống quản lý kho hàng', 'Angular, Spring Boot, PostgreSQL', 'Ongoing', 'https://github.com/group6/inventory-system'),
('Ứng dụng học tập', 7, 'Ứng dụng hỗ trợ học tập', 'React, Django, SQLite', 'Completed', 'https://github.com/group7/learning-app'),
('Hệ điều hành mini', 8, 'Xây dựng hệ điều hành mini', 'C, Assembly', 'Ongoing', 'https://github.com/group8/mini-os'),
('AI nhận diện hình ảnh', 9, 'Ứng dụng AI nhận diện hình ảnh', 'Python, TensorFlow, OpenCV', 'Ongoing', 'https://github.com/group9/image-recognition'),
('Chatbot thông minh', 10, 'Xây dựng chatbot thông minh', 'Python, Flask, NLTK', 'Ongoing', 'https://github.com/group10/smart-chatbot');

USE project_management;
UPDATE Projects
SET created_at = '2025-04-01 00:00:00'
where group_id = 1;
UPDATE Projects
SET created_at = '2025-03-01 00:00:00'
where group_id = 3;

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
INSERT INTO GitContributions (project_id, user_id, commit_hash, commit_message, lines_added, lines_removed, commit_date, created_at) VALUES
(1, 3, '85c0f5c47ce0dc9ca4346e8676e68f24f79e6223', 'commit', 0, 0, '2025-05-22 13:40:34', '2025-05-29 20:13:37'),
(1, 3, '0e4ea01bdf683a7f2082a29c577b9d438454bfdf', 'update 22/05/2025', 239, 9, '2025-05-22 05:40:05', '2025-05-29 20:13:37'),
(1, 3, '0389275c3eeda28e856fcecc193bd03c99ece1ba', 'update', 238, 42, '2025-05-21 16:04:27', '2025-05-29 20:13:37'),
(1, 3, '710a6fc0223c11e7889f47d844b73e8b6f851ece', 'update 21/5/2025', 277, 28, '2025-05-21 08:29:49', '2025-05-29 20:13:37'),
(1, 3, 'c4defdb71b0b94016aa2182a396274d45b51db6b', 'Merge branch ''KanbanView'' of https://github.com/KangSohyun93/Quan_ly_du_an_trong_mon_hoc into KanbanView', 4, 4, '2025-05-11 17:18:51', '2025-05-29 20:13:37'),
(1, 3, '0392c868f2ebc9c2a46bcf3d9c327855400c6b14', 'update', 1553, 756, '2025-05-11 17:18:36', '2025-05-29 20:13:37'),
(1, 3, '548849159ca5c310dd022c90ed4dbdc891bdb765', 'Update db-connect.js', 4, 4, '2025-05-08 12:00:48', '2025-05-29 20:13:37'),
(1, 3, '94d1a54d05355171a30a9f454f8ba8317b1707a5', 'commit', 644, 104, '2025-05-08 11:58:17', '2025-05-29 20:13:37'),
(1, 3, 'f51a794c0fd59bccc18b841713f60239a25a7a5c', 'Merge branch ''KanbanView'' of https://github.com/KangSohyun93/Quan_ly_du_an_trong_mon_hoc into KanbanView', 5, 5, '2025-05-07 15:28:14', '2025-05-29 20:13:37'),
(1, 3, '88b952bd5ddc06e14c0d4143d95efea521eb4de9', 'Commit', 484, 59, '2025-05-07 15:28:00', '2025-05-29 20:13:37'),
(1, 3, '55c3d38933f1c8867582cfce9b928ef00f0a3006', 'Update db-connect.js', 5, 5, '2025-05-02 11:03:46', '2025-05-29 20:13:37'),
(1, 3, 'fe21f2a28f68217ed5760ff2eab3cc45c889a717', 'kanban', 0, 0, '2025-05-02 09:01:45', '2025-05-29 20:13:37'),
(1, 3, 'e45e74aa837e1c7fc7cc9521b7592c4a4ee5e1cd', 'kaban', 6, 615468, '2025-05-02 08:59:52', '2025-05-29 20:13:37'),
(1, 3, 'c4103ccf5da62002e4e8a70d146725a7a9edbe32', 'kanban', 1965037, 0, '2025-05-02 08:54:09', '2025-05-29 20:13:37'),
(1, 3, '8aea0252b3edf54d824fbe9491814521fb486b85', 'kanban', 3523816, 0, '2025-05-02 08:53:27', '2025-05-29 20:13:37'),
(1, 3, '7fe09a84fb767ab7163b30b1953b848d93533c00', 'kanban', 18651, 0, '2025-05-02 08:50:07', '2025-05-29 20:13:37'),
(1, 3, '15106c8378a5c54003ceccfd4633e7fc85069929', 'kanban', 1370372, 0, '2025-05-02 08:47:39', '2025-05-29 20:13:37'),
(1, 3, '326a985f92f3e04f86dda5147cc151acd97a4c59', 'kanban', 0, 60, '2025-05-02 08:46:46', '2025-05-29 20:13:37'),
(1, 2, '2f4aae2198ed0a96d882b4190f0c9f9aeb21089d', 'Create Logo.png', 0, 0, '2025-04-23 16:11:52', '2025-05-29 20:13:37'),
(1, 1, 'fa0305960543b54ae714dfde8854326de79a05be', 'Merge branch ''main'' of https://github.com/KangSohyun93/Quan_ly_du_an_trong_mon_hoc', 60, 0, '2025-04-19 12:44:59', '2025-05-29 20:13:37'),
(1, 1, '0f38147ea4904fd15e459739c87d96103153b1d9', 'Class Diagram', 0, 0, '2025-04-19 12:44:25', '2025-05-29 20:13:37'),
(1, 2, 'ef8e2771418ec4032e8909b10b45c1452aefbc25', 'Create global.css\n\nAdd font and basic color', 60, 0, '2025-04-16 16:10:49', '2025-05-29 20:13:37'),
(1, 4, '3f7e5d6be5ad8547dd0c01e48192aa7330cf00bd', 'Design', 1549, 0, '2025-04-10 07:15:12', '2025-05-29 20:13:37'),
(1, 4, '2fdcdcc3032d6ae324b11928165d54e86181565e', 'Update README.md', 7, 1, '2025-04-09 00:01:38', '2025-05-29 20:13:37'),
(1, 4, '3e2a2250c3dd247479e47645f6bf773688a000e4', 'Initial commit', 1, 0, '2025-04-09 00:00:54', '2025-05-29 20:13:37'),
(1, 4, 'e8a7625361762a6c14734fcab6a05578275f1d9f', 'Cấu trúc cơ bản của dự án', 0, 0, '2025-04-15 16:24:09', '2025-05-29 20:13:37'),
(1, 1, '83b450535516eb8941cb5e39be95aad26d9d4051', 'LOC chart', 550, 389, '2025-05-25 08:27:12', '2025-05-29 20:13:37'),
(1, 1, 'b188f3648b3df555d13fb5f0301c4b11123b95b1', 'Fix commit chart', 1218, 184, '2025-05-22 14:06:00', '2025-05-29 20:13:37'),
(1, 1, '9beaed22648866adfdd488030de8c731314c25a2', 'Add commit chart', 938, 475, '2025-05-22 12:12:56', '2025-05-29 20:13:37'),
(1, 1, '468e300693731b098a118e36038d98989b873c3d', 'Update chart with backend', 747, 249, '2025-05-15 12:37:46', '2025-05-29 20:13:37'),
(1, 1, '1b4e344eb7cf742e09873d9af6d48b24a5390989', 'Update Biểu đồ hoàn thành tash', 3394, 115, '2025-05-15 09:36:45', '2025-05-29 20:13:37'),
(1, 1, 'b27ffbd031f73edc3c9c9b0f587bff8475a84c04', 'Change graph', 1858, 182, '2025-05-13 17:46:04', '2025-05-29 20:13:37'),
(1, 1, '33cb30d5965ff11bc2c40ecd51f8ded44ca00b15', 'Add memberCompletionChart', 1370, 4, '2025-05-08 08:57:33', '2025-05-29 20:13:37'),
(1, 1, '8b1b2de979febe5b387417bcb54c2689c09e0083', 'Edit link after refactor', 2, 2, '2025-05-01 05:30:08', '2025-05-29 20:13:37'),
(1, 1, '5ff2085bddb34597c6f03761ac16916616f49d3b', 'Refactor project structure', 3, 1, '2025-05-01 05:22:36', '2025-05-29 20:13:37'),
(1, 1, '85a6e152fba364f1109f4520bfc9bad5b8646698', 'Sidebar', 3276, 6, '2025-04-26 08:23:01', '2025-05-29 20:13:37'),
(1, 3, '337281c365ba0e61740575aa9767a01d9f50f507', 'commit TeamHeaderForTeacher', 322, 0, '2025-05-21 17:12:09', '2025-05-29 20:13:37'),
(1, 4, 'd66daa216bf6949055fe520a97f270a6e62162e1', 'update db', 690873, 1081258, '2025-05-11 01:53:40', '2025-05-29 20:13:37'),
(1, 4, '8fc91814fe2c5ae1cf05e7c39d1f95584aa2a2ee', 'update sql classmember', 15, 0, '2025-05-10 10:27:52', '2025-05-29 20:13:37'),
(1, 4, '79dc1075e1a0af20ed3b7acaca152e0a22d92dfa', 'update sql, group class, rate,profile sinh viên', 1051247, 368579, '2025-05-02 19:36:17', '2025-05-29 20:13:37'),
(1, 4, '3b4b0042be8a06728c328c5c7d4d422babfcb886', 'groupclass', 4137590, 283, '2025-04-29 06:25:59', '2025-05-29 20:13:37'),
(1, 4, '6e05cf2f31607b70b7bf02c7e75c7dde7af3f392', 'insert sql', 153, 152, '2025-04-23 07:51:51', '2025-05-29 20:13:37'),
(1, 4, 'fa0d7c8136b23de7bdc2b568616ac902dc56d841', 'insert sql', 0, 1987, '2025-04-23 07:44:02', '2025-05-29 20:13:37'),
(1, 4, 'bf8cd0495464e739922d5926a0bcf4e0201d6b7c', 'insert sql', 454, 102, '2025-04-23 07:36:52', '2025-05-29 20:13:37'),
(1, 4, 'ce5622a7d468ccafff119055e29073c5a858b7aa', 'Bảng dữ liệu sql', 2150, 0, '2025-04-17 19:27:36', '2025-05-29 20:13:37'),
(1, 4, 'ab356b2849479d41c0e1f03f540373db18c41ad8', 'backend tạm', 406667, 913, '2025-05-28 00:06:31', '2025-05-29 20:13:37'),
(1, 4, 'd67b7338d14fd3adaffb7c3bcfcc5551bffb71de', 'chỉnh sửa tạm thời', 4558, 188, '2025-05-21 21:05:07', '2025-05-29 20:13:37'),
(1, 5, '19f55e4f360fb6a078b58fd34db1884aed19e6c8', 'update task-comment', 4, 7, '2025-05-28 18:03:11', '2025-05-29 20:13:37'),
(1, 5, '44fea9ac0c60a3ad85f44be72b886a0b237f4da6', 'phan quyen + update task', 77, 33, '2025-05-28 16:43:53', '2025-05-29 20:13:37'),
(1, 5, '91e6f66bc2ae334e181b7c5d2c6bb78c5167d7bc', 'update reload page', 31, 33, '2025-05-28 10:13:05', '2025-05-29 20:13:37'),
(1, 5, '15d8a6b9b457c1abb77a15d8e83304f2486b5b45', 'logout', 13, 35, '2025-05-28 09:26:39', '2025-05-29 20:13:37'),
(1, 5, 'bdf6d12c95893a22f676d9ec3d8821776b516a12', 'task-oke', 2513, 409, '2025-05-28 08:59:38', '2025-05-29 20:13:37'),
(1, 5, '23967f6b19ad1a0fb0a2064d6520d4563ce7097d', 'joinClass-oke', 49, 29, '2025-05-27 13:25:58', '2025-05-29 20:13:37'),
(1, 5, '7acba20960f42a907d7e88bd03716021f413e0c9', 'SV_teamDetail-introduce', 165, 57, '2025-05-27 12:37:51', '2025-05-29 20:13:37'),
(1, 5, '5f7bf69ce563ea85b8d0eeb847ad0d4d1b1e1eca', 'SV_teamClass', 2459, 100, '2025-05-27 11:07:04', '2025-05-29 20:13:37'),
(1, 5, '496a381b436dc85a2f4360399af5de47d0951a73', 'Remove .env from staging and add to .gitignore', 0, 8, '2025-05-20 19:30:42', '2025-05-29 20:13:37'),
(1, 5, '7cc36f19f03c3478f97c9697cdedef8b7896edd7', 'add .gitignore to exclude .env', 2, 1, '2025-05-20 19:28:50', '2025-05-29 20:13:37'),
(1, 5, 'b688bae227bbc645cd0de1777cc25460b7704715', 'Refactor login, register oke', 419, 218, '2025-05-20 19:04:03', '2025-05-29 20:13:37'),
(1, 5, '3023dddc4a5d28b6a49aa62ddc1a8944ecc4a32d', 'update introduce + backend transfer mysql + search_join_class', 1229, 510, '2025-05-15 05:56:52', '2025-05-29 20:13:37'),
(1, 5, '838d8204bb40d2dfccf4b153e74e56cd2e204b46', 'classheader', 428, 4, '2025-05-07 11:54:08', '2025-05-29 20:13:37'),
(1, 5, 'f291aa3b6e817fffacc7febaffa3c3163ab24402', 'update_fe_be', 399, 35, '2025-05-07 06:15:26', '2025-05-29 20:13:37'),
(1, 5, '3de2bd0447211991844f294e7019518105a85f29', 'back-end', 1960, 319, '2025-05-06 14:53:06', '2025-05-29 20:13:37'),
(1, 5, '5889f6bf7204bc048fea28cfc18a3e229ed2e809', 'introduce', 0, 7, '2025-05-01 08:20:04', '2025-05-29 20:13:37'),
(1, 5, 'e674b8009b75559e710207bd5fb135d523d525cc', 'update', 1063, 17, '2025-05-01 08:17:05', '2025-05-29 20:13:37'),
(1, 5, 'b7ce0b3460548523a53f9857f5c8efb41fc9bdac', 'register-form', 20850, 0, '2025-04-18 16:44:07', '2025-05-29 20:13:37'),
(1, 2, '4fd239a4834b5207cfe9cfdd6ceda80c59f8be00', 'update', 1493, 332, '2025-05-21 15:56:50', '2025-05-29 20:13:37'),
(1, 2, 'ac2996df95f15ece3680f3ad0d6ef33246c888fe', 'mmm', 1064, 35545, '2025-05-10 06:07:21', '2025-05-29 20:13:37'),
(1, 2, 'fc9e4bbb19fe1fadb992f22c19f2c4704137ce68', 'Up UserManagerPage', 1130, 889, '2025-05-10 06:06:36', '2025-05-29 20:13:37'),
(1, 2, '00cac8351e295105ea14f938ee37d814339ac1ce', 'Merge branch ''feature/user-manager'' of https://github.com/KangSohyun93/Quan_ly_du_an_trong_mon_hoc into feature/user-manager', 0, 0, '2025-05-08 08:51:05', '2025-05-29 20:13:37'),
(3, 7, '26b2f19fc2df3a17e5c8f551da3a74c86f88a142', 'toi done, don''t call xuan and trang', 62, 16, '2025-05-22 08:40:43', '2025-05-29 20:20:29'),
(3, 7, '71a3551323664c46b60ca3f4a310282029f28ca7', 'Dashboard done', 689, 256, '2025-05-22 07:34:40', '2025-05-29 20:20:29'),
(3, 8, 'd86121c22205f495cc2a7ef274b5190f2d5e2950', 'thêm logout cho admin', 55, 2, '2025-05-12 03:32:40', '2025-05-29 20:20:29'),
(3, 8, 'fb9ee72f9d4631f3cb63aaea525dbfe28dfc68b4', 'admin sign in', 19, 5, '2025-05-01 18:59:00', '2025-05-29 20:20:29'),
(3, 8, '2b086241b7830b898fbfa37a3355f76e9b0e69b8', 'Merge branch ''admin-backup'' into Trang-test', 3219, 2, '2025-05-01 17:49:52', '2025-05-29 20:20:29'),
(3, 8, '978a986b49b2a64a9249cdc3708c9d083cd0b04b', 'update rename', 29, 34, '2025-05-01 17:33:48', '2025-05-29 20:20:29'),
(3, 8, '15a43f3fb32121af8fe8f50fbdd3e81dce4bcf7e', 'rename', 6, 385, '2025-05-01 16:55:42', '2025-05-29 20:20:29'),
(3, 8, '3e346078e8a24005d88d7da6f4e0b51599fddbde', 'move node to backend', 0, 687578, '2025-05-01 15:47:12', '2025-05-29 20:20:29'),
(3, 8, '943534ca2031d7af3a53c3cba97553427de2f430', 'node', 687578, 0, '2025-05-01 15:10:41', '2025-05-29 20:20:29'),
(3, 1, '098baab7d64d2118022a25702c041c9f1e419091', 'Merge with feature/footer-detail branch', 3941, 488, '2025-04-24 17:14:04', '2025-05-29 20:20:29'),
(3, 1, '8ce1d4b390ab574e0af2838ac024c6f2aa74adf0', 'Fix link', 2, 2, '2025-04-24 14:25:11', '2025-05-29 20:20:29'),
(3, 1, 'b821e39274f56991c4187fddea67098c514e4f14', 'Fix', 48, 425, '2025-04-24 14:09:58', '2025-05-29 20:20:29'),
(3, 1, '07d0534490e798dedf76ad2c7a216ae11adff000', 'Merge with feature/search branch', 578, 9, '2025-04-24 11:22:59', '2025-05-29 20:20:29'),
(3, 1, '0ce7160faf4f9b0a3a7799abd8f74ec0b788138c', 'Fix link', 7, 6, '2025-04-24 11:09:54', '2025-05-29 20:20:29'),
(3, 1, '60a3003d73cd9fd1f2ad7df45df1f5dd7b1e7ae2', 'Merge with feature/profile branch', 1250, 194210, '2025-04-24 11:04:16', '2025-05-29 20:20:29'),
(3, 1, '9ac3e9800bcb7141945d3ef7bcf1e2c9099c683b', 'Merge with feature/user-homepage branch', 1695, 5, '2025-04-24 10:25:17', '2025-05-29 20:20:29'),
(3, 1, '882de185e4513d2de14717f59af77c9035dcdd8f', 'Merge with feature/auth branch', 92754, 10136, '2025-04-24 10:16:31', '2025-05-29 20:20:29'),
(3, 8, 'f400c5039b8f167b36850e3b9acc540fdde903b3', 'sửa fe', 144, 61, '2025-04-20 18:08:43', '2025-05-29 20:20:29'),
(3, 8, 'd776db839c02ae165446e011c13523260c053a86', 'admin quản lý user, recipe, report', 3108, 9, '2025-04-20 09:35:15', '2025-05-29 20:20:29'),
(3, 4, 'bc4c1de9bd2f7fc138ce80aca10d14e00dd2a9ab', 'up chi tiết footer', 379429, 251, '2025-04-17 18:16:12', '2025-05-29 20:20:29'),
(3, 2, '250e628b7460a99f130edd72c01a634e82232a5a', 'Update', 1691, 0, '2025-04-17 14:52:22', '2025-05-29 20:20:29'),
(3, 2, 'a0f6d2b1bcad1efe2ef89e46728cd84563142383', 'Change api to use Model', 65, 35, '2025-04-15 16:31:38', '2025-05-29 20:20:29'),
(3, 7, 'f01d7d3b8a5ce209a34b7c4b07d981d742e1b13e', 'login logout dashboard backend', 1, 0, '2025-04-15 06:26:54', '2025-05-29 20:20:29'),
(3, 2, '2165ebce24af3d20105dffd8040fc7776036474d', 'Update image', 1, 1, '2025-04-15 05:46:23', '2025-05-29 20:20:29'),
(3, 2, 'bba90abed6498d7c0cf6a9f24a3fcb0b2d0c540d', 'update', 33, 18, '2025-04-15 05:30:25', '2025-05-29 20:20:29'),
(3, 7, '5e2ecadcb5a6b7176e65fccdce8cebaca77679be', 'done auth and dashboard backend', 15105, 99, '2025-04-14 09:46:29', '2025-05-29 20:20:29'),
(3, 7, '165503a80511f24924c970cbf565273aa1017dd2', 'done auth and dashboard frontend', 111, 6, '2025-04-14 09:39:17', '2025-05-29 20:20:29'),
(3, 7, '95685d0f9e80740ddb005ae0895e020b912bd66c', 'done autheiencation', 70396, 11, '2025-04-13 09:59:19', '2025-05-29 20:20:29'),
(3, 1, '62af27ffdd68e371bb58d6b7f69992b2b43cb339', 'Update image', 0, 0, '2025-04-13 07:22:21', '2025-05-29 20:20:29'),
(3, 2, '46870db95a55a36e3ddb971195784d5fb6a3b9c7', 'change logic search serving and fix interface', 17, 10, '2025-04-12 20:12:49', '2025-05-29 20:20:29'),
(3, 2, 'bf0ecb3c47865bf886dca337bf56b5da63193fef', 'change to use recipeModel', 127, 130, '2025-04-12 19:42:32', '2025-05-29 20:20:29'),
(3, 7, 'f5e8170f69c2a7937854e71f05660909126d8b7b', 'done sign up', 6745, 771, '2025-04-12 19:32:57', '2025-05-29 20:20:29'),
(3, 2, '13d243a5c86e1d4eb9dae1d1e953f965fe4babe4', 'Update recipeRoutes.js', 3, 0, '2025-04-12 19:04:37', '2025-05-29 20:20:29'),
(3, 2, '1dbec880931dd709f5d101a8b5ba23b5256f779b', 'fix interface serving and ''See details'' hover', 20, 2, '2025-04-12 18:56:45', '2025-05-29 20:20:29'),
(3, 2, 'acc03eb7b756175768d3b1854baa5ca12c873fc2', 'update search basic by ingredient, serving,...', 86, 31, '2025-04-12 18:40:07', '2025-05-29 20:20:29'),
(3, 2, '40248c5ebb721fc516c446b9736524bb9dd2b444', 'update select ingredients, serving,...', 263, 49, '2025-04-12 17:44:12', '2025-05-29 20:20:29'),
(3, 1, '8e7d0703680a9c56af461237f212c0f5e3be3949', 'Fix header responsive', 8, 4, '2025-04-11 14:58:55', '2025-05-29 20:20:29'),
(3, 1, '791e2771ad5855efae77df9d422969d4ffb36f82', 'Update edit password feature', 234, 86, '2025-04-11 14:53:00', '2025-05-29 20:20:29'),
(3, 1, '132ddfb23c59148fd9fce24e629c6874755c6b7d', 'Update edit profile feature', 15853, 45, '2025-04-11 11:55:35', '2025-05-29 20:20:29'),
(3, 1, '3277ef23eb32586e9ad2fda3b07ff89053468563', 'Responsive header and footer', 182, 11, '2025-04-11 06:42:34', '2025-05-29 20:20:29'),
(3, 1, '69dc632824121a9f0cecc0dc6cc35226c08b4a35', 'Add edit profile + password form to profile page', 320, 177, '2025-04-08 18:12:19', '2025-05-29 20:20:29'),
(3, 1, 'bf2f85b2bc01c33be92f1d41a6b3aa7d41a212f1', 'Edit edit profile page', 53, 33, '2025-04-08 12:31:06', '2025-05-29 20:20:29'),
(3, 1, '8167e6548e780ccef9c003bd0661a9e06c87656e', 'Merge branch ''main'' of https://github.com/tranvananhanhanh/CookHub_Web', 0, 0, '2025-04-05 14:13:42', '2025-05-29 20:20:29'),
(3, 1, '81a3d36c6fc119a0d4810846ae18152df89698ae', 'Merge sql assets and components from feature/profile into main', 1927, 220, '2025-04-05 14:12:52', '2025-05-29 20:20:29'),
(3, 1, '360c7e202cfddcb25908b2cfab860d463fb5bc32', 'Update database', 951, 458, '2025-04-05 13:48:21', '2025-05-29 20:20:29'),
(3, 1, 'b01ce1db2f4bab5b5d2147c84a9815218372afa4', 'Update insert data and refactor image folder', 870, 497, '2025-04-03 15:49:40', '2025-05-29 20:20:29'),
(3, 2, '31424bfb6dc623ff1f400eadd20efb3362433f74', 'update', 758, 5, '2025-04-03 09:13:48', '2025-05-29 20:20:29'),
(3, 4, '694ab9830ae76c07115855a324adcdd1d66d5345', 'create page front end', 509, 0, '2025-03-30 06:26:35', '2025-05-29 20:20:29'),
(3, 7, '2db22a6cdf34eb9608f1a8571c3d487f4b822a89', 'Loi man hinh trang', 65, 55, '2025-03-30 05:53:21', '2025-05-29 20:20:29'),
(3, 1, '2527ccc7b27b18d8bcc914a60573e3b224dd6f23', 'Edit SQL', 702, 156, '2025-03-30 05:09:13', '2025-05-29 20:20:29'),
(3, 7, '05688a693e39cb01874634239c51ed76b8aa4289', 'Loi hien thi man hinh', 11, 4, '2025-03-30 04:59:37', '2025-05-29 20:20:29'),
(3, 7, '8ef5202f7764bbf854ae336d759bd6663a362cb7', 'Let''s go cookhub', 371, 0, '2025-03-30 04:15:01', '2025-05-29 20:20:29'),
(3, 1, '5df7b5d51e8b7172ca4f1b0cc2cd3d3a9d8b1acf', 'Edit link in profile and header', 7, 7, '2025-03-29 12:00:50', '2025-05-29 20:20:29'),
(3, 1, '5c8783372c513a0a8d3f36ee6037fb4ad6809451', 'Refactor image folder', 0, 0, '2025-03-29 11:53:38', '2025-05-29 20:20:29'),
(3, 1, '09348f69e7659971e828ddd0ba5647ac2b3c5966', 'See more button', 33, 11, '2025-03-29 10:50:18', '2025-05-29 20:20:29'),
(3, 1, '2a58805bec052830a4ab1c2b5f9334ecb0695922', 'Refactor node_modules', 2620, 2656, '2025-03-29 10:34:20', '2025-05-29 20:20:29'),
(3, 1, 'cec28fd7d3122deb2a8bace94d17a3961b83371c', 'Load image, avatar, name, id from db', 93987, 372, '2025-03-29 09:17:43', '2025-05-29 20:20:29'),
(3, 1, '64c0cba27da7d3925a7c724e712a76c336cd13b7', 'Merge pull request #4 from tranvananhanhanh/feature/profile\n\nFeature/profile', 68, 49, '2025-03-28 00:53:18', '2025-05-29 20:20:29'),
(3, 1, 'dd2c99297f3d6a8df413b3f01c38dd9299e99125', 'Update style.css', 1, 192, '2025-03-28 00:52:04', '2025-05-29 20:20:29'),
(3, 1, '430e661945102e5cc611cd2dd85cdf6969a6528a', 'Merge branch ''feature/profile'' of https://github.com/tranvananhanhanh/CookHub_Web into feature/profile', 3, 3, '2025-03-28 00:46:02', '2025-05-29 20:20:29'),
(3, 1, '99377b55a429ea3a356e5fc988b03cb8d37dbc8f', 'Separate header and footer', 258, 48, '2025-03-28 00:45:25', '2025-05-29 20:20:29'),
(3, 1, '3f1abd30d7c2a8a1ecfe25777090ff6e25f03ab1', 'Merge pull request #3 from tranvananhanhanh/feature/profile\n\nFeature/profile', 130206, 81, '2025-03-23 17:49:33', '2025-05-29 20:20:29'),
(3, 1, 'b597b6593212e43263679fc18605871640ee2e14', 'Merge pull request #2 from tranvananhanhanh/main\n\nUpdate README.md', 3, 3, '2025-03-23 17:48:18', '2025-05-29 20:20:29'),
(3, 1, 'a184b581c954e2a123bee4544d5beadbfeed8a58', 'Update SQL', 42, 55, '2025-03-23 17:45:33', '2025-05-29 20:20:29'),
(3, 1, 'ddbb12581377c92d89f30d2dc7a2dcf60f3f362a', 'Update database and add footer', 250, 114, '2025-03-23 11:21:43', '2025-05-29 20:20:29'),
(3, 1, '3126c51e5ccc1ebe23b50097bbbe64f37918fac5', 'Create profile.html and create image folder and update file styles.css', 649, 2, '2025-03-22 20:17:34', '2025-05-29 20:20:29'),
(3, 6, 'c5ff034fa92cc996bf12dc0f091c7ae2d837cd87', 'Update README.md', 3, 3, '2025-03-21 11:22:48', '2025-05-29 20:20:29'),
(3, 1, 'f27938d3dd45caa0c2ca8031ee2e4a84a5472b16', 'Updae', 44880, 9, '2025-03-15 16:42:10', '2025-05-29 20:20:29'),
(3, 1, '401a42de468c20cdec55ac82a3645bf2cedb7f12', '.', 912, 4, '2025-03-15 12:04:24', '2025-05-29 20:20:29'),
(3, 1, '789330b2dd320c24924fa967f92463665f0ab267', 'Merge branch ''feature/database'' into feature/baseBE', 34, 0, '2025-03-15 11:38:16', '2025-05-29 20:20:29'),
(3, 1, 'aed23108d9474034673c4f0670df6bf289e99cf7', 'Insert data to database', 34, 0, '2025-03-15 11:33:14', '2025-05-29 20:20:29'),
(3, 1, '3353ccdf34c551a72fa232d490aa8b047ecf64d5', 'Update db.js', 2, 2, '2025-03-15 11:15:18', '2025-05-29 20:20:29'),
(3, 1, '9dc48bd41de19dc6f9bd1329e2efbd72c45e169b', 'Install pg + dotenv node_modules', 16542, 2, '2025-03-15 10:41:53', '2025-05-29 20:20:29'),
(3, 1, '1b3ed25a70974979f765e11223a7ee093e4e9f04', 'Install express', 67002, 0, '2025-03-15 10:29:11', '2025-05-29 20:20:29'),
(3, 1, 'e32ccc96d0fa1156f349d212949891b98eba6325', 'Merge branch ''feature/database''', 65, 0, '2025-03-15 09:38:16', '2025-05-29 20:20:29'),
(3, 1, 'a0086f47d7c7e66ffdd891dfa226cc09b86cf820', 'Merge branch ''feature/baseFE''', 62, 0, '2025-03-15 09:37:23', '2025-05-29 20:20:29'),
(3, 1, '0f09fbcc7f8726c4da8c425c555264575ea6bea0', 'Update README.md', 6, 0, '2025-03-15 09:33:29', '2025-05-29 20:20:29'),
(3, 1, 'f3eccc621afba1580efa73578d74792893c5dd75', 'Create index.html file', 14, 0, '2025-03-15 09:31:30', '2025-05-29 20:20:29'),
(3, 1, 'a247e8f9a4d648947d1313d4dc333521d1e6b90e', 'Resolve merge conflict in README.md', 8, 0, '2025-03-15 09:28:15', '2025-05-29 20:20:29'),
(3, 6, 'fe357bf105a80e81ba9733ec8d4bd80e6295d488', 'creat table for databse', 65, 0, '2025-03-13 04:56:19', '2025-05-29 20:20:29'),
(3, 6, '89713b817ce5514fc99d13340a02cf0451177a9d', 'Delete README.md', 0, 8, '2025-03-10 16:41:06', '2025-05-29 20:20:29'),
(3, 6, 'd6c387dcf72e6211715ad0ffcfb95dece1ca26fa', 'Update README.md', 6, 0, '2025-03-10 16:39:42', '2025-05-29 20:20:29'),
(3, 6, '13eab61c1f4546c0abc427200d64ba5838b33c89', 'Hướng dẫn th project các tv team README.md', 6, 0, '2025-03-10 16:37:55', '2025-05-29 20:20:29'),
(3, 6, '6b00315006417204978417cfc2ad99b041b38ce8', 'creat structure fontend', 48, 0, '2025-03-10 16:28:55', '2025-05-29 20:20:29'),
(3, 6, '3e11c8e360c17751f0133ff794e12d7e564e5dc6', 'creat structure backend', 59, 0, '2025-03-10 16:18:50', '2025-05-29 20:20:29'),
(3, 6, '3d2e2d0378dce2ce7b2d999aaa625601de289831', 'Initial commit', 2, 0, '2025-03-03 14:50:40', '2025-05-29 20:20:29'),
(3, 2, '29f04a7a875c01e1916a5f389417c1b639b8d58e', 'update Header to get userId', 316, 40, '2025-05-07 07:38:11', '2025-05-29 20:20:29'),
(3, 2, 'ce151b53d95d51f2e9cfc169c9d69a141ab24df9', 'Update take userID', 32, 3, '2025-05-06 14:54:00', '2025-05-29 20:20:29'),
(3, 2, 'b476b41f4fbb2f028d1bb693add61f7ada524a4e', 'update homepage to DetailRecipe', 139, 17, '2025-05-06 05:30:20', '2025-05-29 20:20:29'),
(3, 6, '7ce319d82991dbd29b222c311f44f13442264706', 'update code of na task', 2728, 73, '2025-04-27 10:03:46', '2025-05-29 20:20:29'),
(3, 6, 'b1f12090661ba566e4b5a5a850ac2115c6158f94', 'image step visual', 143, 35, '2025-05-18 09:03:16', '2025-05-29 20:20:29'),
(3, 6, 'eb02cc49823e723fb817af7597ded5a3fd578cea', 'na task done', 348, 160, '2025-05-12 08:32:53', '2025-05-29 20:20:29'),
(3, 2, '6a86f1fe4d5a790e174387e7f786085f2ddd7c78', 'add Report', 195, 17, '2025-05-10 04:58:04', '2025-05-29 20:20:29'),
(3, 2, '231dc75037b925717bedd91780dbabdf7a72733d', 'fix filter Ingredient', 83, 45, '2025-05-10 04:57:40', '2025-05-29 20:20:29'),
(3, 2, 'fa89a4772270f76dab95f076c9bb6701a6135687', 'Change Image, fix homepage\n\nChange Image for Feature Recipes, add pop up Error when save before login', 39, 9, '2025-05-09 16:42:23', '2025-05-29 20:20:29'),
(3, 2, 'dbec36bd58928018e6329d200339542f8cb90a65', 'Update LoginButton\n\nLoginBtn and delete when user already login', 16, 7, '2025-05-09 15:04:18', '2025-05-29 20:20:29'),
(3, 1, '184685a84e1b2d5474d1c351f2f6a9f6a8580658', 'Sửa css', 7, 19, '2025-05-09 11:48:29', '2025-05-29 20:20:29'),
(3, 1, '84fea723979b04e60109f0c0f62c921eeeddcbac', 'Merge with feature/profile branch. Get user_id from URL', 1152, 5712, '2025-05-09 11:10:29', '2025-05-29 20:20:29'),
(3, 1, '88e656c3cc1b95c8cc1a2e90fe447d57d6ef997c', 'Merge with Giang''s change', 315, 39, '2025-05-09 11:01:34', '2025-05-29 20:20:29'),
(3, 1, '907ef37077e7c7d2075a902d295755fde53e0769', 'Get userID from URL', 27, 19, '2025-05-07 02:22:20', '2025-05-29 20:20:29'),
(3, 1, '62bb02e783d424553e42c19a82ac646ced4fdd18', 'Fix render avatar on header', 157, 32, '2025-05-07 02:12:56', '2025-05-29 20:20:29'),
(3, 1, '802271a4b4366420f891d3051119394257d3d414', 'Fix logic edit avatar + profile background', 108, 7, '2025-05-07 00:59:49', '2025-05-29 20:20:29'),
(3, 1, '6b6298c3a81a14304fa115bc0bdd35533b12055c', 'Fix recipe''s detail link', 158, 90, '2025-05-06 23:50:49', '2025-05-29 20:20:29'),
(3, 1, 'a591f93e59824d7bad9a36b88615c5d57cdb89b2', 'Sửa lại dữ liệu', 0, 8, '2025-05-06 15:30:05', '2025-05-29 20:20:30'),
(3, 1, '5da95ad4be02530ceb14764991308852317627fd', 'Pull', 25, 1, '2025-05-06 15:28:02', '2025-05-29 20:20:30'),
(3, 1, 'f0c9dd2e2ab3917c88b14e404743ad651e54378d', 'Merge with demo', 74, 7, '2025-05-06 15:20:50', '2025-05-29 20:20:30'),
(3, 1, 'e5b114c2c4707ed650996296e5136346700f0a98', 'Fix cònlicts', 75, 8, '2025-05-06 15:18:19', '2025-05-29 20:20:30'),
(3, 1, '74901d1e1031cdb326c9a9b5b11a5394c230631d', 'Add remove recipe btn and popup component', 305, 88, '2025-05-06 13:01:35', '2025-05-29 20:20:30'),
(3, 1, 'f508b3c62d17553d08e638e211356dac8c3b8702', 'Edit recipes fe', 470, 193, '2025-05-06 10:02:39', '2025-05-29 20:20:30'),
(3, 1, '1c4bcba2e3b211b0216b54fa89b485474275f808', 'Queries comments, social links from database', 277, 98, '2025-05-04 16:41:39', '2025-05-29 20:20:30'),
(3, 1, 'b02c8f42fcf0416691ee09c5c05be5d91af30734', 'Merge from main', 0, 5364, '2025-05-04 11:44:34', '2025-05-29 20:20:30'),
(3, 1, 'ecc7b70614bfc4685d0cc5eb63d6e11852465d0c', 'Edit header active', 1, 2, '2025-05-04 11:31:37', '2025-05-29 20:20:30'),
(3, 1, 'ba6c6d3c4f54e98b87b530b0fa7ced5054bf1640', 'Merge with detailRecipe & cookchart page', 1709, 65, '2025-05-04 11:25:49', '2025-05-29 20:20:30'),
(3, 1, 'e4b9cf0245b786536fa71e18ae0709e12cb19807', 'Fix header & footer', 4, 55, '2025-05-04 04:22:17', '2025-05-29 20:20:30'),
(3, 1, '5d39b030a2c6a68a6f963bacb41f3d0aca9b7bfa', 'Merge with feature/create-page branch', 556967, 1077, '2025-05-03 21:23:21', '2025-05-29 20:20:30'),
(3, 1, '1d7cc23e50a1b710c262fba6245f0c7282a8b7d0', 'Merge with feature/bmi branch', 80170, 15, '2025-05-03 20:39:12', '2025-05-29 20:20:30'),
(3, 1, '47802767d6f5e101019795bbbc93cb7fe8916b9d', 'Fix steps upload images', 666, 4065, '2025-05-03 17:50:56', '2025-05-29 20:20:30'),
(3, 1, '5d8ac5a6ccc52d16c27d0f672d8dfb3e4275f6c0', 'Fix frontend', 453248, 142, '2025-04-30 13:54:08', '2025-05-29 20:20:30'),
(3, 1, '554c88136c7b076904cbe2313bb4aa9d8869cfc9', 'Update API', 201801, 219, '2025-04-24 08:29:02', '2025-05-29 20:20:30'),
(3, 1, '16871f1df12a81d82638f9ccd40db83762efb3e1', 'Merge branch ''feature/profile'' into feature/create-page', 111743, 436, '2025-04-13 07:23:54', '2025-05-29 20:20:30'),
(3, 6, 'e0dd91a59086a2fc25bd81db65df8ae6c932dbcd', 'Add BMI feature', 84340, 21, '2025-03-21 11:36:11', '2025-05-29 20:20:30'),
(3, 1, '13723999f5050b2cb04b555773c43504bbba53e2', 'Sửa tiếng Việt -> tiếng Anh', 8, 8, '2025-05-24 10:41:54', '2025-05-29 20:20:30'),
(3, 1, '766760441528e0529d2112a2875bac4721684dfd', '.', 2, 31, '2025-05-24 10:32:57', '2025-05-29 20:20:30'),
(3, 1, '89e06f4db0a92a343f3ec6387390988d6f649c7c', 'Thêm phần chọn category khi create công thức', 334, 7, '2025-05-24 08:00:16', '2025-05-29 20:20:30'),
(3, 1, 'a2f3972032a8cfac990004d9e91f47b7984c067d', 'Thêm phần hiện approved khi mới tạo công thức', 163, 77, '2025-05-24 07:04:15', '2025-05-29 20:20:30'),
(3, 1, 'a20da506989fb4bcdc2a70b352f15b9923e621ad', 'Remove comment', 0, 72, '2025-05-23 16:18:45', '2025-05-29 20:20:30'),
(3, 1, '1bac1f4240edc3348d3ecde4bb89e268dfdbbac4', 'Sửa random code đăng ký; hiển thị avatar, background mặc định; active ở header, sửa các cột thời gian ở CSDL thành timestamp with time zone', 270, 81, '2025-05-23 16:17:51', '2025-05-29 20:20:30'),
(3, 1, '07e88e5b39fab61626d6ac311ffa05d0f859ec9f', 'Merge with branch feature/savedRecipes', 3639, 217, '2025-05-23 13:40:23', '2025-05-29 20:20:30'),
(3, 1, 'c661ffdaf07e219e15c2af276e0034b28fbf48dc', 'Merge with branch demo1', 470, 173, '2025-05-23 13:25:56', '2025-05-29 20:20:30'),
(3, 1, 'f98ea7472a652a8ad4112727bcc0c8433d875a58', 'Fix welcome img', 2, 2, '2025-05-23 13:04:15', '2025-05-29 20:20:30'),
(3, 1, '0256b92045e0f8d17b513eed8f2f3fa286f7e89c', 'Remove node_modules and package-lock.json from Git tracking', 3, 586896, '2025-05-23 13:03:24', '2025-05-29 20:20:30'),
(3, 1, '49b3976c98e687220c671e9ffc6c94eaa2eb30a3', 'Fix wellcome animation', 32, 25, '2025-05-23 12:44:53', '2025-05-29 20:20:30'),
(3, 1, '04f6a675ac1f9e13c486a5b37442d2bdf5fd4f0f', 'Merge with admin branch', 5798, 47543, '2025-05-22 09:32:56', '2025-05-29 20:20:30'),
(3, 2, '97103584921974e37717e5f2f3f7673dbf09d0c0', 'Merge branch ''main'' of https://github.com/tranvananhanhanh/CookHub_Web', 4358, 2664, '2025-05-13 05:20:50', '2025-05-29 20:20:30'),
(3, 2, 'ea5536264d51d2644147b8949e6926f09742a51e', 'Update Search', 35, 10, '2025-05-13 05:20:47', '2025-05-29 20:20:30'),
(3, 4, '19e5fb34a68febd103f15f0fe5abe5bc0c1b86c1', 'saved routes, image, footer,style.css, loadHTML,detail recipes', 403, 270, '2025-05-12 08:05:47', '2025-05-29 20:20:30'),
(3, 1, '5fe662f0e023c0dbb2f85a884ac7d7e4a7124c5f', 'Add avatar & background for user 3', 0, 0, '2025-05-12 07:41:11', '2025-05-29 20:20:30'),
(3, 1, '996cd02d7ff0658dc38c97ff6112325fe898c1fd', 'feature/profile Sua nut xoa recipe va them thong bao khi edit password thanh cong', 84, 19, '2025-05-11 08:18:50', '2025-05-29 20:20:30'),
(3, 1, 'd88bb83dd36d04b917e9ae075af3adc55ae0a0ee', 'Add cancel button to popup', 26, 8, '2025-05-11 06:39:05', '2025-05-29 20:20:30'),
(3, 1, '876f8a0b55e378a9eb16ed3f4fc17da1a39070da', 'Sửa css', 5, 1, '2025-05-11 05:25:43', '2025-05-29 20:20:30'),
(3, 1, '6e774837e84aafcc7b95bb0f580ea7e7f750aa80', 'Add logout button', 87, 239, '2025-05-11 05:12:25', '2025-05-29 20:20:30'),
(3, 1, '18552475f93f5307477e974a12768d32af985712', 'Remove recipe 21', 0, 0, '2025-05-11 04:14:12', '2025-05-29 20:20:30'),
(3, 1, 'fb60d5587a1ebea7ad7eaa760a7a30b38814ca14', 'Update popup and route', 4384, 2625, '2025-05-11 04:13:33', '2025-05-29 20:20:30'),
(3, 1, 'c456b0e11d454a6df2ea0319985995190d89cad5', 'Update database', 1857, 107, '2025-04-05 13:57:29', '2025-05-29 20:20:30'),
(3, 4, '815781c5402da9797f43e79092b68722e3e046e2', 'footer detail and saved recipes', 653, 646, '2025-04-24 11:39:36', '2025-05-29 20:20:30'),
(3, 2, '1faf8dcb36e732a58e941d6bb80e4aaf3c290160', 'add logic save', 320, 62, '2025-05-03 08:43:26', '2025-05-29 20:20:30'),
(3, 2, '80a41f6f430cbe37ff4934aa179e6226ca642519', 'Update homepage.css', 0, 7, '2025-05-02 15:21:20', '2025-05-29 20:20:30'),
(3, 2, '6e8831a3c6e768151dd83b5f56d51f8fc78620ae', 'Update Logic Login', 322, 39, '2025-04-24 14:07:05', '2025-05-29 20:20:30'),
(3, 2, '7ca502c7e8d963be1de87f40e352394a2eedacee', 'Cài đặt express-session', 9117, 5, '2025-04-24 14:06:32', '2025-05-29 20:20:30'),
(3, 8, '81104eee0eb5095331c48fb8d7cd610566da3129', 'update logout', 22, 0, '2025-05-29 07:35:51', '2025-05-29 20:20:30'),
(3, 1, '1db6a2d517262ad9774793e3ceeae43291516627', 'ERD Diagram', 1, 1, '2025-05-25 08:23:54', '2025-05-29 20:20:30'),
(3, 1, '71542947cc364cd122544a4a02bd12517dc8b3ef', 'Thêm ảnh', 0, 0, '2025-05-24 15:54:34', '2025-05-29 20:20:30'),
(3, 1, 'e347505b4358cd7f97e820ad6752787d2a54fde0', 'Sửa css bmi', 38, 32, '2025-05-24 11:07:21', '2025-05-29 20:20:30'),
(3, 1, 'b87105281546ed68b79dcf56f7a1511b45ddfcbf', 'Merge branch ''feature/create-page''', 476, 92, '2025-05-24 10:44:26', '2025-05-29 20:20:30'),
(3, 2, '3d454ce6320e69282220b6e09aed265e909b5e15', 'change search', 2, 2, '2025-05-24 09:56:57', '2025-05-29 20:20:30'),
(3, 2, '5d899b60e976464ebef123cf2f2052aa1eac9eea', 'Update detailRecipe.ejs', 3, 2, '2025-05-24 09:56:10', '2025-05-29 20:20:30'),
(3, 2, 'c1a91de1e6f3c7c4082891b3beccc396fe2c0917', 'Update search.js', 4, 4, '2025-05-24 09:29:24', '2025-05-29 20:20:30'),
(3, 2, 'c25ef6feee6d7480682f7757e77fa5ab995b6d5c', 'Merge branch ''main'' of https://github.com/tranvananhanhanh/CookHub_Web', 5144, 629939, '2025-05-24 09:19:37', '2025-05-29 20:20:30'),
(3, 2, 'c6a2846a7f15f1de705071d3959530cfff834db8', 'update avatar', 2, 1, '2025-05-24 09:19:34', '2025-05-29 20:20:30'),
(1, 5, '0547b616884a986e22c384b29f5f681b8252753b', 'admin_userManager_hien thi ds', 1127, 271, '2025-05-30 04:45:17', '2025-05-30 14:46:37'),
(1, 5, '9cb1443e422d69a66dec1e098334f48ec6f61c46', 'init assessment', 670, 5, '2025-05-29 15:51:42', '2025-05-30 14:46:37'),
(1, 5, 'be30f6799c5e66c2da19d521953e6fb3f87596c2', 'sidebar-update user', 205, 42, '2025-05-29 12:38:16', '2025-05-30 14:46:37'),
(1, 5, 'cb44b9273d7198200220aa37a20838bc425659ce', 'update task-avatar', 24, 10, '2025-05-29 11:05:00', '2025-05-30 14:46:37'),
(1, 1, '72944982ebe9ecde4d03c4edc581b61eef9a4376', 'Đồng bộ nút refresh data', 1408, 355, '2025-05-30 08:12:30', '2025-05-30 15:40:07'),
(1, 1, 'fde6b9d8fd0cb826f473eba9e953a8341442239c', 'LOC chart', 249, 1040, '2025-05-29 14:56:26', '2025-05-30 15:40:07'),
(1, 1, 'edcfd44fa32e9e692f5d1d1389b65ed6701277e7', 'LOC chart', 550, 389, '2025-05-25 08:27:12', '2025-05-30 15:40:07'),
(1, 1, 'f1c0ee369c7d6f2a3d0998a7a9cfc9b4cd56b3c3', 'Fix commit chart', 1218, 184, '2025-05-22 14:06:00', '2025-05-30 15:40:07'),
(1, 1, 'efbe48ed0b68afa5d23a3458773d57e4d2835b8d', 'Add commit chart', 938, 475, '2025-05-22 12:12:56', '2025-05-30 15:40:07'),
(1, 1, '60a40783ede4f9ef791674f3681563433e104a9d', 'Update chart with backend', 747, 249, '2025-05-15 12:37:46', '2025-05-30 15:40:07'),
(1, 1, 'b70fa3517745d68f6b1988b2c4f4c4c0d016273c', 'Update Biểu đồ hoàn thành tash', 3394, 115, '2025-05-15 09:36:45', '2025-05-30 15:40:07'),
(1, 1, '0a0a9ca39bb16137c19fb826df6918e83088db23', 'Change graph', 1858, 182, '2025-05-13 17:46:04', '2025-05-30 15:40:07'),
(1, 1, '57f9cdd43db006b2a04a101cfe0cb245bdf8bb54', 'Add memberCompletionChart', 1370, 4, '2025-05-08 08:57:33', '2025-05-30 15:40:07'),
(1, 1, '0ab4522398f58b359c60aa8a370c17f6fc1d471b', 'Edit link after refactor', 2, 2, '2025-05-01 05:30:08', '2025-05-30 15:40:07'),
(1, 1, '0a1fdb57783d88a7501919e23384d557ff25848a', 'Refactor project structure', 3, 1, '2025-05-01 05:22:36', '2025-05-30 15:40:07'),
(1, 1, '9ba82cf51c395c49382c989c28f39d2ae3547f4d', 'Sidebar', 3276, 6, '2025-04-26 08:23:01', '2025-05-30 15:40:07'),
(1, 1, '05c1cd05ff1df3266424df45a5567ed6fdcac74f', 'Merge branch ''main'' of https://github.com/KangSohyun93/Quan_ly_du_an_trong_mon_hoc', 60, 0, '2025-04-19 12:44:59', '2025-05-30 15:40:07'),
(1, 1, '75d5ffc9dff69ca7fed2c844e3a1eadb1d6bdf6a', 'Class Diagram', 0, 0, '2025-04-19 12:44:25', '2025-05-30 15:40:07'),
(1, 2, '0c8019be21ee6d596e65c4e76b8b2786991ec6ff', 'Create global.css\n\nAdd font and basic color', 60, 0, '2025-04-16 16:10:49', '2025-05-30 15:40:07'),
(1, 4, 'f15b6f44461acdd7f6fb051780e143775adf8bcf', 'Design', 1549, 0, '2025-04-10 07:15:12', '2025-05-30 15:40:07'),
(1, 4, '922a96816234b58f7f581701707d25d77b10ba7a', 'Update README.md', 7, 1, '2025-04-09 00:01:38', '2025-05-30 15:40:07'),
(1, 4, 'da3ecff01c401fddad149de93158431f1bdd4c38', 'Initial commit', 1, 0, '2025-04-09 00:00:54', '2025-05-30 15:40:07'),
(1, 2, '21f779c15b650a5fa1f560c7e0e86c1d35514ac4', 'Create Logo.png', 0, 0, '2025-04-23 16:11:52', '2025-05-30 15:40:08'),
(1, 5, '4e54bee401bceb5af49bbb55ad34a8af8e471164', 'Admin-edit-user', 986, 19, '2025-05-30 13:17:35', '2025-05-30 20:28:58'),
(1, 5, '97ecd3f7c0d95a510a4d57cec64941f0fd8805f6', 'Admin-class-manager', 495, 1, '2025-05-30 09:14:39', '2025-05-30 20:28:58');

-- Chèn dữ liệu vào bảng PeerAssessments
INSERT INTO PeerAssessments (group_id, assessor_id, assessee_id, deadline_score, friendly_score, quality_score, team_support_score, responsibility_score, note) VALUES
-- Nhóm 1
(1, 2, 1, 5, 5, 4, 4, 5, 'Hoàn thành công việc đúng hạn và hỗ trợ nhóm tốt.'),
(1, 3, 1, 4, 5, 4, 5, 4, 'Cần cải thiện tốc độ hoàn thành nhiệm vụ.'),
(1, 1, 2, 5, 4, 5, 4, 5, 'Chất lượng công việc tốt, cần thân thiện hơn.'),
-- Nhóm 2
(2, 6, 7, 5, 5, 5, 4, 5, 'Thành viên xuất sắc, hỗ trợ nhóm rất tốt.'),
(2, 7, 6, 4, 5, 4, 5, 4, 'Cần chú ý hơn đến chất lượng công việc.'),
-- Nhóm 3
(3, 8, 7, 5, 4, 5, 4, 5, 'Đúng hạn và có trách nhiệm cao.'),
(3, 6, 7, 4, 5, 4, 5, 4, 'Thân thiện nhưng cần cải thiện chất lượng.'),
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