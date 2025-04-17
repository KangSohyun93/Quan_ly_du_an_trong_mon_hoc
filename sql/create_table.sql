-- Tạo cơ sở dữ liệu
CREATE DATABASE project_management;
USE project_management;

-- Bảng Người dùng: Lưu thông tin người dùng (Sinh viên, Giảng viên, Quản trị)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY, -- Mã định danh duy nhất
    username VARCHAR(50) UNIQUE NOT NULL, -- Tên đăng nhập (chữ hoặc số)
    email VARCHAR(100) UNIQUE NOT NULL, -- Email duy nhất
    password VARCHAR(255) NOT NULL, -- Mật khẩu
    role ENUM('Student', 'Instructor', 'Admin') NOT NULL, -- Vai trò: Sinh viên, Giảng viên, Quản trị
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo tài khoản
    is_active BOOLEAN DEFAULT TRUE -- Trạng thái tài khoản (kích hoạt/khóa)
);

-- Bảng Lớp học: Lưu thông tin lớp học
CREATE TABLE Classes (
    class_id INT PRIMARY KEY CHECK (class_id >= 100000 AND class_id <= 999999), -- Mã lớp học 6 chữ số
    class_name VARCHAR(100) NOT NULL, -- Tên lớp học
    instructor_id INT NOT NULL, -- Mã giảng viên phụ trách
    semester VARCHAR(10) CHECK (semester REGEXP '^[0-9]{4}\.[1-3]$'), -- Học kỳ (VD: 2025.1, 2023.3)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo lớp
    FOREIGN KEY (instructor_id) REFERENCES Users(user_id) ON DELETE RESTRICT
);

-- Bảng Nhóm: Lưu thông tin các nhóm trong lớp
CREATE TABLE Groups (
    group_id INT AUTO_INCREMENT PRIMARY KEY, -- Mã nhóm duy nhất toàn hệ thống
    group_name VARCHAR(50) NOT NULL, -- Tên nhóm
    class_id INT NOT NULL, -- Mã lớp học chứa nhóm
    leader_id INT NOT NULL, -- Mã nhóm trưởng
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo nhóm
    FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE CASCADE,
    FOREIGN KEY (leader_id) REFERENCES Users(user_id) ON DELETE RESTRICT
);

-- Bảng Thành viên nhóm: Lưu danh sách thành viên trong nhóm
CREATE TABLE GroupMembers (
    group_id INT NOT NULL, -- Mã nhóm
    user_id INT NOT NULL, -- Mã thành viên
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tham gia nhóm
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES Groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Bảng Dự án: Lưu thông tin dự án của lớp
CREATE TABLE Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY, -- Mã dự án duy nhất
    project_name VARCHAR(100) NOT NULL, -- Tên dự án
    class_id INT NOT NULL, -- Mã lớp học chứa dự án
    description TEXT, -- Mô tả dự án
    github_repo_url VARCHAR(255), -- URL kho mã GitHub
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo dự án
    FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE CASCADE
);

-- Bảng Công việc: Lưu thông tin nhiệm vụ trong dự án
CREATE TABLE Tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY, -- Mã công việc duy nhất
    project_id INT NOT NULL, -- Mã dự án chứa công việc
    title VARCHAR(100) NOT NULL, -- Tiêu đề công việc
    description TEXT, -- Mô tả công việc
    assigned_to INT, -- Mã người được giao việc
    status ENUM('To-Do', 'In-Progress', 'Done') NOT NULL DEFAULT 'To-Do', -- Trạng thái công việc
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo công việc
    due_date DATETIME, -- Hạn chót
    completed_at DATETIME, -- Thời gian hoàn thành
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- Bảng Cập nhật công việc: Theo dõi tiến độ công việc
CREATE TABLE TaskUpdates (
    update_id INT AUTO_INCREMENT PRIMARY KEY, -- Mã cập nhật duy nhất
    task_id INT NOT NULL, -- Mã công việc được cập nhật
    user_id INT NOT NULL, -- Mã người cập nhật
    update_description TEXT, -- Mô tả cập nhật
    progress_percentage INT CHECK (progress_percentage >= 0 AND progress_percentage <= 100), -- Tỷ lệ tiến độ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian cập nhật
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Bảng Đóng góp GitHub: Lưu thông tin đóng góp mã nguồn
CREATE TABLE GitContributions (
    contribution_id INT AUTO_INCREMENT PRIMARY KEY, -- Mã đóng góp duy nhất
    project_id INT NOT NULL, -- Mã dự án liên quan
    user_id INT NOT NULL, -- Mã người đóng góp
    commit_hash VARCHAR(40) NOT NULL, -- Mã commit GitHub
    commit_message TEXT, -- Thông điệp commit
    lines_added INT DEFAULT 0, -- Số dòng mã thêm
    lines_removed INT DEFAULT 0, -- Số dòng mã xóa
    commit_date DATETIME NOT NULL, -- Thời gian commit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian ghi nhận
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Bảng Đánh giá chéo: Lưu đánh giá giữa các thành viên
CREATE TABLE PeerAssessments (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY, -- Mã đánh giá duy nhất
    group_id INT NOT NULL, -- Mã nhóm
    assessor_id INT NOT NULL, -- Mã người đánh giá
    assessee_id INT NOT NULL, -- Mã người được đánh giá
    contribution_score INT CHECK (contribution_score >= 0 AND contribution_score <= 10), -- Điểm đóng góp (0-10)
    cooperation_score INT CHECK (cooperation_score >= 0 AND cooperation_score <= 10), -- Điểm hợp tác (0-10)
    quality_score INT CHECK (quality_score >= 0 AND quality_score <= 10), -- Điểm chất lượng (0-10)
    comments TEXT, -- Nhận xét
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian đánh giá
    FOREIGN KEY (group_id) REFERENCES Groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (assessor_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (assessee_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Bảng Đánh giá của Giảng viên: Lưu đánh giá từ giảng viên
CREATE TABLE InstructorEvaluations (
    evaluation_id INT AUTO_INCREMENT PRIMARY KEY, -- Mã đánh giá duy nhất
    group_id INT NOT NULL, -- Mã nhóm
    user_id INT NOT NULL, -- Mã sinh viên được đánh giá
    instructor_id INT NOT NULL, -- Mã giảng viên đánh giá
    score INT CHECK (score >= 0 AND score <= 10), -- Điểm số (0-10)
    comments TEXT, -- Nhận xét
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian đánh giá
    FOREIGN KEY (group_id) REFERENCES Groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Bảng Cấu hình hệ thống: Lưu các cài đặt hệ thống
CREATE TABLE SystemConfigurations (
    config_id INT AUTO_INCREMENT PRIMARY KEY, -- Mã cấu hình duy nhất
    config_key VARCHAR(50) NOT NULL, -- Tên khóa cấu hình
    config_value TEXT NOT NULL, -- Giá trị cấu hình
    description TEXT, -- Mô tả cấu hình
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian cập nhật
    updated_by INT, -- Mã người cập nhật
    FOREIGN KEY (updated_by) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- Bảng Token đặt lại mật khẩu: Lưu token để đặt lại mật khẩu
CREATE TABLE PasswordResetTokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY, -- Mã token duy nhất
    user_id INT NOT NULL, -- Mã người dùng
    token VARCHAR(255) NOT NULL, -- Token đặt lại mật khẩu
    expires_at DATETIME NOT NULL, -- Thời gian hết hạn
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo token
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Chỉ mục để tối ưu hiệu suất
CREATE INDEX idx_users_email ON Users(email); -- Chỉ mục cho email người dùng
CREATE INDEX idx_tasks_project_id ON Tasks(project_id); -- Chỉ mục cho mã dự án trong công việc
CREATE INDEX idx_task_updates_task_id ON TaskUpdates(task_id); -- Chỉ mục cho mã công việc trong cập nhật
CREATE INDEX idx_git_contributions_project_id ON GitContributions(project_id); -- Chỉ mục cho mã dự án trong đóng góp Git
CREATE INDEX idx_peer_assessments_group_id ON PeerAssessments(group_id); -- Chỉ mục cho mã nhóm trong đánh giá chéo
CREATE INDEX idx_instructor_evaluations_group_id ON InstructorEvaluations(group_id); -- Chỉ mục cho mã nhóm trong đánh giá giảng viên

-- Dữ liệu mẫu cho Cấu hình hệ thống
/*INSERT INTO SystemConfigurations (config_key, config_value, description) VALUES
('github_api_token', 'placeholder_token', 'Token cho tích hợp API GitHub'),
('notification_email', 'enabled', 'Bật/tắt thông báo qua email'),
('max_group_size', '6', 'Số lượng thành viên tối đa mặc định cho nhóm');