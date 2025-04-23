-- Chèn dữ liệu vào bảng Users
INSERT INTO Users (username, email, password, role, is_active, avatar) VALUES
-- 30 sinh viên
('Student1', 'student1@example.com', 'hashed_password_1', 'Student', TRUE, 'student1.jpg'),
('Student2', 'student2@example.com', 'hashed_password_2', 'Student', TRUE, 'student2.jpg'),
('Student3', 'student3@example.com', 'hashed_password_3', 'Student', TRUE, 'student3.jpg'),
('Student4', 'student4@example.com', 'hashed_password_4', 'Student', TRUE, 'student4.jpg'),
('Student5', 'student5@example.com', 'hashed_password_5', 'Student', TRUE, 'student5.jpg'),
('Student6', 'student6@example.com', 'hashed_password_6', 'Student', TRUE, 'student6.jpg'),
('Student7', 'student7@example.com', 'hashed_password_7', 'Student', TRUE, 'student7.jpg'),
('Student8', 'student8@example.com', 'hashed_password_8', 'Student', TRUE, 'student8.jpg'),
('Student9', 'student9@example.com', 'hashed_password_9', 'Student', TRUE, 'student9.jpg'),
('Student10', 'student10@example.com', 'hashed_password_10', 'Student', TRUE, 'student10.jpg'),
('Student11', 'student11@example.com', 'hashed_password_11', 'Student', TRUE, 'student11.jpg'),
('Student12', 'student12@example.com', 'hashed_password_12', 'Student', TRUE, 'student12.jpg'),
('Student13', 'student13@example.com', 'hashed_password_13', 'Student', TRUE, 'student13.jpg'),
('Student14', 'student14@example.com', 'hashed_password_14', 'Student', TRUE, 'student14.jpg'),
('Student15', 'student15@example.com', 'hashed_password_15', 'Student', TRUE, 'student15.jpg'),
('Student16', 'student16@example.com', 'hashed_password_16', 'Student', TRUE, 'student16.jpg'),
('Student17', 'student17@example.com', 'hashed_password_17', 'Student', TRUE, 'student17.jpg'),
('Student18', 'student18@example.com', 'hashed_password_18', 'Student', TRUE, 'student18.jpg'),
('Student19', 'student19@example.com', 'hashed_password_19', 'Student', TRUE, 'student19.jpg'),
('Student20', 'student20@example.com', 'hashed_password_20', 'Student', TRUE, 'student20.jpg'),
('Student21', 'student21@example.com', 'hashed_password_21', 'Student', TRUE, 'student21.jpg'),
('Student22', 'student22@example.com', 'hashed_password_22', 'Student', TRUE, 'student22.jpg'),
('Student23', 'student23@example.com', 'hashed_password_23', 'Student', TRUE, 'student23.jpg'),
('Student24', 'student24@example.com', 'hashed_password_24', 'Student', TRUE, 'student24.jpg'),
('Student25', 'student25@example.com', 'hashed_password_25', 'Student', TRUE, 'student25.jpg'),
('Student26', 'student26@example.com', 'hashed_password_26', 'Student', TRUE, 'student26.jpg'),
('Student27', 'student27@example.com', 'hashed_password_27', 'Student', TRUE, 'student27.jpg'),
('Student28', 'student28@example.com', 'hashed_password_28', 'Student', TRUE, 'student28.jpg'),
('Student29', 'student29@example.com', 'hashed_password_29', 'Student', TRUE, 'student29.jpg'),
('Student30', 'student30@example.com', 'hashed_password_30', 'Student', TRUE, 'student30.jpg'),
-- 3 giảng viên
('ProfSmith', 'smith@example.com', 'hashed_password_31', 'Instructor', TRUE, 'smith.jpg'),
('ProfJones', 'jones@example.com', 'hashed_password_32', 'Instructor', TRUE, 'jones.jpg'),
('ProfBrown', 'brown@example.com', 'hashed_password_33', 'Instructor', TRUE, 'brown.jpg'),
-- 1 quản trị viên
('Admin1', 'admin1@example.com', 'hashed_password_34', 'Admin', TRUE, 'admin1.jpg');

-- Chèn dữ liệu vào bảng Classes
INSERT INTO Classes (class_id, class_name, instructor_id, semester) VALUES
(100001, 'Công nghệ phần mềm', 31, '2025.1'), -- ProfSmith
(100002, 'Lập trình web', 32, '2025.1'), -- ProfJones
(100003, 'Cấu trúc dữ liệu', 33, '2025.2'), -- ProfBrown
(100004, 'Hệ điều hành', 31, '2025.2'), -- ProfSmith
(100005, 'Trí tuệ nhân tạo', 32, '2025.2'); -- ProfJones

-- Chèn dữ liệu vào bảng Groups
INSERT INTO Groups (group_name, class_id, leader_id) VALUES
('Nhóm 1', 100001, 1),  -- Student1
('Nhóm 2', 100001, 4),  -- Student4
('Nhóm 3', 100002, 7),  -- Student7
('Nhóm 4', 100002, 10), -- Student10
('Nhóm 5', 100003, 13), -- Student13
('Nhóm 6', 100003, 16), -- Student16
('Nhóm 7', 100004, 19), -- Student19
('Nhóm 8', 100004, 22), -- Student22
('Nhóm 9', 100005, 25), -- Student25
('Nhóm 10', 100005, 28); -- Student28

-- Chèn dữ liệu vào bảng GroupMembers
INSERT INTO GroupMembers (group_id, user_id) VALUES
-- Nhóm 1: Student1 (trưởng nhóm), Student2, Student3, Student4
(1, 1), (1, 2), (1, 3), (1, 4),
-- Nhóm 2: Student4 (trưởng nhóm), Student5, Student6, Student7
(2, 4), (2, 5), (2, 6), (2, 7),
-- Nhóm 3: Student7 (trưởng nhóm), Student8, Student9, Student10, Student11
(3, 7), (3, 8), (3, 9), (3, 10), (3, 11),
-- Nhóm 4: Student10 (trưởng nhóm), Student12, Student13, Student14
(4, 10), (4, 12), (4, 13), (4, 14),
-- Nhóm 5: Student13 (trưởng nhóm), Student15, Student16, Student17
(5, 13), (5, 15), (5, 16), (5, 17),
-- Nhóm 6: Student16 (trưởng nhóm), Student18, Student19, Student20, Student21
(6, 16), (6, 18), (6, 19), (6, 20), (6, 21),
-- Nhóm 7: Student19 (trưởng nhóm), Student22, Student23, Student24
(7, 19), (7, 22), (7, 23), (7, 24),
-- Nhóm 8: Student22 (trưởng nhóm), Student25, Student26, Student27
(8, 22), (8, 25), (8, 26), (8, 27),
-- Nhóm 9: Student25 (trưởng nhóm), Student28, Student29, Student30
(9, 25), (9, 28), (9, 29), (9, 30),
-- Nhóm 10: Student28 (trưởng nhóm), Student1, Student2, Student3, Student4
(10, 28), (10, 1), (10, 2), (10, 3), (10, 4);

-- Chèn dữ liệu vào bảng Projects
INSERT INTO Projects (project_name, class_id, description, status, github_repo_url) VALUES
('Hệ thống quản lý thư viện', 100001, 'Xây dựng hệ thống quản lý thư viện trực tuyến', 'Ongoing', 'https://github.com/group1/library-system'),
('Ứng dụng đặt vé xem phim', 100001, 'Ứng dụng đặt vé xem phim trên mobile', 'Completed', 'https://github.com/group2/movie-ticket'),
('Website bán hàng', 100002, 'Website thương mại điện tử bán hàng', 'Ongoing', 'https://github.com/group3/ecommerce'),
('Ứng dụng ghi chú', 100002, 'Ứng dụng ghi chú đơn giản', 'Cancelled', 'https://github.com/group4/notes-app'),
('Phân tích dữ liệu sinh viên', 100003, 'Phân tích dữ liệu sinh viên bằng Python', 'Ongoing', 'https://github.com/group5/student-analysis'),
('Hệ thống quản lý kho', 100003, 'Hệ thống quản lý kho hàng', 'Ongoing', 'https://github.com/group6/inventory-system'),
('Ứng dụng học tập', 100004, 'Ứng dụng hỗ trợ học tập', 'Completed', 'https://github.com/group7/learning-app'),
('Hệ điều hành mini', 100004, 'Xây dựng hệ điều hành mini', 'Ongoing', 'https://github.com/group8/mini-os'),
('AI nhận diện hình ảnh', 100005, 'Ứng dụng AI nhận diện hình ảnh', 'Ongoing', 'https://github.com/group9/image-recognition'),
('Chatbot thông minh', 100005, 'Xây dựng chatbot thông minh', 'Ongoing', 'https://github.com/group10/smart-chatbot');

-- Chèn dữ liệu vào bảng Tasks
-- Loại bỏ trạng thái 'Cancelled' và thay thế bằng 'To-Do'
INSERT INTO Tasks (project_id, title, description, assigned_to, status, due_date, completed_at, progress_percentage) VALUES
-- Dự án 1: Hệ thống quản lý thư viện (Nhóm 1)
(1, 'Thiết kế giao diện', 'Thiết kế giao diện người dùng', 1, 'Done', '2025-04-10 23:59:00', '2025-04-09 10:00:00', 100),
(1, 'Xây dựng API', 'Xây dựng API cho hệ thống', 2, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
(1, 'Kiểm thử hệ thống', 'Kiểm thử các chức năng', 3, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
(1, 'Tài liệu', 'Viết tài liệu', 4, 'Done', '2025-04-10 23:59:00', '2025-04-09 10:00:00', 100),
(1, 'Cải thiện hiệu suất', 'Tối ưu hiệu suất', 1, 'Done', '2025-04-10 23:59:00', '2025-04-09 10:00:00', 100),
-- Dự án 2: Ứng dụng đặt vé xem phim (Nhóm 2)
(2, 'Cơ sở dữ liệu', 'Thiết kế CSDL cho ứng dụng', 4, 'Done', '2025-03-20 23:59:00', '2025-03-21 10:00:00', 100),
(2, 'Giao diện đặt vé', 'Thiết kế giao diện đặt vé', 5, 'Done', '2025-03-25 23:59:00', '2025-03-24 10:00:00', 100),
(2, 'Tích hợp thanh toán', 'Tích hợp cổng thanh toán', 6, 'Done', '2025-03-30 23:59:00', '2025-03-29 10:00:00', 100),
(2, 'Kiểm thử', 'Kiểm thử ứng dụng', 7, 'Done', '2025-03-30 23:59:00', '2025-03-29 10:00:00', 100),
(2, 'Triển khai', 'Triển khai ứng dụng', 4, 'Done', '2025-03-30 23:59:00', '2025-03-29 10:00:00', 100),
-- Dự án 3: Website bán hàng (Nhóm 3)
(3, 'Trang chủ', 'Thiết kế trang chủ', 7, 'In-Progress', '2025-04-15 23:59:00', NULL, 33),
(3, 'Giỏ hàng', 'Chức năng giỏ hàng', 8, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
(3, 'Thanh toán', 'Chức năng thanh toán', 9, 'To-Do', '2025-04-25 23:59:00', NULL, 0),
(3, 'Quản lý sản phẩm', 'Chức năng quản lý sản phẩm', 10, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
(3, 'Tìm kiếm', 'Chức năng tìm kiếm sản phẩm', 11, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
-- Dự án 4: Ứng dụng ghi chú (Nhóm 4)
(4, 'Giao diện chính', 'Thiết kế giao diện chính', 10, 'Done', '2025-03-10 23:59:00', '2025-03-09 10:00:00', 100),
(4, 'Lưu trữ ghi chú', 'Chức năng lưu trữ ghi chú', 12, 'Done', '2025-03-15 23:59:00', '2025-03-14 10:00:00', 100),
(4, 'Đồng bộ hóa', 'Đồng bộ hóa với cloud', 13, 'To-Do', '2025-03-20 23:59:00', NULL, 0), -- Thay 'Cancelled' bằng 'To-Do'
(4, 'Giao diện phụ', 'Thiết kế giao diện phụ', 14, 'Done', '2025-03-10 23:59:00', '2025-03-09 10:00:00', 100),
(4, 'Kiểm thử', 'Kiểm thử ứng dụng', 12, 'Done', '2025-03-15 23:59:00', '2025-03-14 10:00:00', 100),
-- Dự án 5: Phân tích dữ liệu sinh viên (Nhóm 5)
(5, 'Thu thập dữ liệu', 'Thu thập dữ liệu sinh viên', 13, 'Done', '2025-04-05 23:59:00', '2025-04-04 10:00:00', 100),
(5, 'Phân tích dữ liệu', 'Phân tích dữ liệu bằng Python', 15, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
(5, 'Báo cáo', 'Viết báo cáo phân tích', 16, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
(5, 'Trực quan hóa', 'Trực quan hóa dữ liệu', 17, 'To-Do', '2025-04-25 23:59:00', NULL, 0),
(5, 'Kiểm thử', 'Kiểm thử phân tích', 15, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
-- Dự án 6: Hệ thống quản lý kho (Nhóm 6)
(6, 'Thiết kế CSDL', 'Thiết kế cơ sở dữ liệu', 16, 'Done', '2025-04-05 23:59:00', '2025-04-04 10:00:00', 100),
(6, 'Giao diện nhập kho', 'Thiết kế giao diện nhập kho', 18, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
(6, 'Giao diện xuất kho', 'Thiết kế giao diện xuất kho', 19, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
(6, 'Báo cáo kho', 'Chức năng báo cáo kho', 20, 'To-Do', '2025-04-25 23:59:00', NULL, 0),
(6, 'Tích hợp API', 'Tích hợp API quản lý kho', 21, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
-- Dự án 7: Ứng dụng học tập (Nhóm 7)
(7, 'Giao diện chính', 'Thiết kế giao diện chính', 19, 'Done', '2025-03-10 23:59:00', '2025-03-09 10:00:00', 100),
(7, 'Quản lý bài học', 'Chức năng quản lý bài học', 22, 'Done', '2025-03-15 23:59:00', '2025-03-14 10:00:00', 100),
(7, 'Kiểm tra', 'Chức năng kiểm tra', 23, 'Done', '2025-03-20 23:59:00', '2025-03-19 10:00:00', 100),
(7, 'Thống kê', 'Chức năng thống kê tiến độ', 24, 'Done', '2025-03-20 23:59:00', '2025-03-19 10:00:00', 100),
(7, 'Triển khai', 'Triển khai ứng dụng', 19, 'Done', '2025-03-20 23:59:00', '2025-03-19 10:00:00', 100),
-- Dự án 8: Hệ điều hành mini (Nhóm 8)
(8, 'Khởi tạo hệ thống', 'Khởi tạo hệ thống cơ bản', 22, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
(8, 'Quản lý bộ nhớ', 'Chức năng quản lý bộ nhớ', 25, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
(8, 'Quản lý tiến trình', 'Chức năng quản lý tiến trình', 26, 'To-Do', '2025-04-25 23:59:00', NULL, 0),
(8, 'Hệ thống file', 'Chức năng hệ thống file', 27, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
(8, 'Kiểm thử', 'Kiểm thử hệ thống', 25, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
-- Dự án 9: AI nhận diện hình ảnh (Nhóm 9)
(9, 'Thu thập dữ liệu', 'Thu thập dữ liệu hình ảnh', 25, 'Done', '2025-04-05 23:59:00', '2025-04-04 10:00:00', 100),
(9, 'Huấn luyện mô hình', 'Huấn luyện mô hình AI', 28, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
(9, 'Kiểm thử mô hình', 'Kiểm thử mô hình AI', 29, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
(9, 'Triển khai API', 'Triển khai API nhận diện', 30, 'To-Do', '2025-04-25 23:59:00', NULL, 0),
(9, 'Tài liệu', 'Viết tài liệu', 28, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
-- Dự án 10: Chatbot thông minh (Nhóm 10)
(10, 'Thiết kế giao diện', 'Thiết kế giao diện chatbot', 28, 'Done', '2025-04-05 23:59:00', '2025-04-04 10:00:00', 100),
(10, 'Xử lý ngôn ngữ', 'Chức năng xử lý ngôn ngữ', 1, 'In-Progress', '2025-04-15 23:59:00', NULL, 50),
(10, 'Tích hợp API', 'Tích hợp API chatbot', 2, 'To-Do', '2025-04-20 23:59:00', NULL, 0),
(10, 'Kiểm thử', 'Kiểm thử chatbot', 3, 'To-Do', '2025-04-25 23:59:00', NULL, 0),
(10, 'Triển khai', 'Triển khai chatbot', 4, 'In-Progress', '2025-04-15 23:59:00', NULL, 50);

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
(2, 4, 'c3d4e5f6g7h8i9j0k1l2', 'Thiết kế CSDL', 80, 5, '2025-03-21 10:00:00'),
(3, 7, 'd4e5f6g7h8i9j0k1l2m3', 'Thêm giao diện trang chủ', 200, 30, '2025-04-10 15:00:00'),
(5, 13, 'e5f6g7h8i9j0k1l2m3n4', 'Thu thập dữ liệu sinh viên', 120, 15, '2025-04-04 10:00:00');

-- Chèn dữ liệu vào bảng PeerAssessments
INSERT INTO PeerAssessments (group_id, assessor_id, assessee_id, deadline_score, friendly_score, quality_score, team_support_score, responsibility_score) VALUES
-- Nhóm 1
(1, 2, 1, 5, 5, 4, 4, 5), -- Student2 đánh giá Student1
(1, 3, 1, 4, 5, 4, 5, 4), -- Student3 đánh giá Student1
(1, 1, 2, 5, 4, 5, 4, 5), -- Student1 đánh giá Student2
-- Nhóm 2
(2, 5, 4, 5, 5, 5, 4, 5), -- Student5 đánh giá Student4
(2, 6, 4, 4, 5, 4, 5, 4), -- Student6 đánh giá Student4
-- Nhóm 3
(3, 8, 7, 5, 4, 5, 4, 5), -- Student8 đánh giá Student7
(3, 9, 7, 4, 5, 4, 5, 4), -- Student9 đánh giá Student7
-- Nhóm 4
(4, 12, 10, 5, 5, 4, 4, 5), -- Student12 đánh giá Student10
(4, 13, 10, 4, 5, 5, 4, 4), -- Student13 đánh giá Student10
-- Nhóm 5
(5, 15, 13, 5, 4, 5, 5, 4), -- Student15 đánh giá Student13
(5, 16, 13, 4, 5, 4, 5, 5), -- Student16 đánh giá Student13
-- Nhóm 6
(6, 18, 16, 5, 5, 4, 4, 5), -- Student18 đánh giá Student16
(6, 19, 16, 4, 5, 5, 4, 4), -- Student19 đánh giá Student16
-- Nhóm 7
(7, 22, 19, 5, 4, 5, 5, 4), -- Student22 đánh giá Student19
(7, 23, 19, 4, 5, 4, 5, 5), -- Student23 đánh giá Student19
-- Nhóm 8
(8, 25, 22, 5, 5, 4, 4, 5), -- Student25 đánh giá Student22
(8, 26, 22, 4, 5, 5, 4, 4), -- Student26 đánh giá Student22
-- Nhóm 9
(9, 28, 25, 5, 4, 5, 5, 4), -- Student28 đánh giá Student25
(9, 29, 25, 4, 5, 4, 5, 5), -- Student29 đánh giá Student25
-- Nhóm 10
(10, 1, 28, 5, 5, 4, 4, 5), -- Student1 đánh giá Student28
(10, 2, 28, 4, 5, 5, 4, 4); -- Student2 đánh giá Student28

-- Chèn dữ liệu vào bảng InstructorEvaluations
INSERT INTO InstructorEvaluations (group_id, user_id, instructor_id, score, comments) VALUES
(1, 1, 31, 8, 'Làm việc tốt, cần cải thiện giao tiếp.'),
(1, 2, 31, 7, 'Hoàn thành công việc đúng hạn.'),
(2, 4, 31, 9, 'Nhóm trưởng xuất sắc.'),
(3, 7, 32, 8, 'Làm việc chăm chỉ.'),
(4, 10, 32, 7, 'Cần cải thiện kỹ năng quản lý thời gian.'),
(5, 13, 33, 9, 'Công việc chất lượng cao.'),
(6, 16, 33, 8, 'Hỗ trợ nhóm tốt.'),
(7, 19, 31, 7, 'Cần chú ý đến chi tiết hơn.'),
(8, 22, 31, 8, 'Làm việc nhóm tốt.'),
(9, 25, 32, 9, 'Hoàn thành công việc xuất sắc.'),
(10, 28, 32, 8, 'Tích cực trong dự án.');

-- Chèn dữ liệu vào bảng SystemConfigurations
INSERT INTO SystemConfigurations (config_key, config_value, description, updated_by) VALUES
('max_group_size', '5', 'Số thành viên tối đa trong một nhóm', 34),
('task_deadline_reminder', '2', 'Số ngày trước hạn để gửi nhắc nhở', 34),
('peer_assessment_deadline', '2025-05-01', 'Hạn chót đánh giá ngang hàng', 34);

-- Chèn dữ liệu vào bảng PasswordResetTokens
INSERT INTO PasswordResetTokens (user_id, token, expires_at) VALUES
(1, 'token_123', '2025-04-24 23:59:00'),
(4, 'token_456', '2025-04-24 23:59:00'),
(7, 'token_789', '2025-04-24 23:59:00');