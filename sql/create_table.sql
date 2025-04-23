-- Tạo cơ sở dữ liệu
DROP DATABASE IF EXISTS project_management; -- Xóa cơ sở dữ liệu có tên 'project_management' nếu đã tồn tại, tránh lỗi khi tạo mới.
CREATE DATABASE project_management; -- Tạo cơ sở dữ liệu mới có tên 'project_management'.
USE project_management; -- Chuyển sang sử dụng cơ sở dữ liệu 'project_management' để thực hiện các lệnh tiếp theo.

-- Bảng Users: Lưu thông tin người dùng (sinh viên, giảng viên, quản trị viên)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự động tăng, khóa chính để định danh người dùng.
    username VARCHAR(100) UNIQUE NOT NULL, -- Tên người dùng, duy nhất, không được để trống (tối đa 100 ký tự).
    email VARCHAR(100) UNIQUE NOT NULL, -- Email người dùng, duy nhất, không được để trống (tối đa 100 ký tự).
    password VARCHAR(255) NOT NULL, -- Mật khẩu (đã mã hóa), không được để trống, tối đa 255 ký tự.
    role ENUM('Student', 'Instructor', 'Admin') NOT NULL, -- Vai trò người dùng, chỉ nhận giá trị 'Student', 'Instructor', hoặc 'Admin'.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo tài khoản, mặc định là thời gian hiện tại.
    is_active BOOLEAN DEFAULT TRUE, -- Trạng thái hoạt động của tài khoản, mặc định là TRUE (kích hoạt).
    avatar VARCHAR(255) -- Đường dẫn đến ảnh đại diện, có thể để trống (tối đa 255 ký tự).
);

-- Bảng Classes: Lưu thông tin lớp học
CREATE TABLE Classes (
    class_id INT PRIMARY KEY, -- ID lớp học, khóa chính, không tự động tăng (do dữ liệu mẫu sử dụng số cố định như 100001).
    class_name VARCHAR(50) NOT NULL, -- Tên lớp học, không được để trống, tối đa 50 ký tự.
    instructor_id INT NOT NULL, -- ID giảng viên phụ trách lớp, không được để trống.
    semester VARCHAR(10), -- Học kỳ (ví dụ: '2025.1'), có thể để trống, tối đa 10 ký tự.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo lớp học, mặc định là thời gian hiện tại.
    FOREIGN KEY (instructor_id) REFERENCES Users(user_id) ON DELETE RESTRICT -- Khóa ngoại liên kết với Users(user_id), không cho xóa giảng viên nếu đang phụ trách lớp.
);

-- Bảng Groups: Lưu thông tin nhóm trong lớp
CREATE TABLE Groups (
    group_id INT AUTO_INCREMENT PRIMARY KEY, -- ID nhóm, tự động tăng, khóa chính.
    group_name VARCHAR(50) NOT NULL, -- Tên nhóm, không được để trống, tối đa 50 ký tự.
    class_id INT NOT NULL, -- ID lớp học mà nhóm thuộc về, không được để trống.
    leader_id INT NOT NULL, -- ID trưởng nhóm, không được để trống.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo nhóm, mặc định là thời gian hiện tại.
    FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE CASCADE, -- Khóa ngoại liên kết với Classes(class_id), xóa lớp sẽ xóa nhóm.
    FOREIGN KEY (leader_id) REFERENCES Users(user_id) ON DELETE RESTRICT -- Khóa ngoại liên kết với Users(user_id), không cho xóa trưởng nhóm nếu nhóm tồn tại.
);

-- Bảng GroupMembers: Lưu thông tin thành viên của nhóm (quan hệ nhiều-nhiều giữa Groups và Users)
CREATE TABLE GroupMembers (
    group_id INT NOT NULL, -- ID nhóm, không được để trống.
    user_id INT NOT NULL, -- ID người dùng (thành viên), không được để trống.
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tham gia nhóm, mặc định là thời gian hiện tại.
    PRIMARY KEY (group_id, user_id), -- Khóa chính kết hợp từ group_id và user_id, đảm bảo không trùng lặp thành viên trong nhóm.
    FOREIGN KEY (group_id) REFERENCES Groups(group_id) ON DELETE CASCADE, -- Khóa ngoại liên kết với Groups(group_id), xóa nhóm sẽ xóa thành viên.
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE -- Khóa ngoại liên kết với Users(user_id), xóa người dùng sẽ xóa tư cách thành viên.
);

-- Bảng Projects: Lưu thông tin dự án trong lớp
CREATE TABLE Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY, -- ID dự án, tự động tăng, khóa chính.
    project_name VARCHAR(100) NOT NULL, -- Tên dự án, không được để trống, tối đa 100 ký tự.
    class_id INT NOT NULL, -- ID lớp học mà dự án thuộc về, không được để trống.
    description TEXT, -- Mô tả dự án, có thể để trống.
    status ENUM('Ongoing', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Ongoing', -- Trạng thái dự án, chỉ nhận giá trị 'Ongoing', 'Completed', hoặc 'Cancelled', mặc định là 'Ongoing'.
    github_repo_url VARCHAR(255), -- Đường dẫn đến kho GitHub, có thể để trống, tối đa 255 ký tự.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo dự án, mặc định là thời gian hiện tại.
    FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE CASCADE -- Khóa ngoại liên kết với Classes(class_id), xóa lớp sẽ xóa dự án.
);

-- Bảng Tasks: Lưu thông tin công việc trong dự án
CREATE TABLE Tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY, -- ID công việc, tự động tăng, khóa chính.
    project_id INT NOT NULL, -- ID dự án mà công việc thuộc về, không được để trống.
    title VARCHAR(100) NOT NULL, -- Tiêu đề công việc, không được để trống, tối đa 100 ký tự.
    description TEXT, -- Mô tả công việc, có thể để trống.
    assigned_to INT, -- ID người được giao công việc, có thể để trống (NULL nếu chưa giao).
    status ENUM('To-Do', 'In-Progress', 'Done') NOT NULL DEFAULT 'To-Do', -- Trạng thái công việc, chỉ nhận giá trị 'To-Do', 'In-Progress', hoặc 'Done', mặc định là 'To-Do'.
    progress_percentage INT DEFAULT 0, -- Tiến độ công việc (0-100), mặc định là 0%.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo công việc, mặc định là thời gian hiện tại.
    due_date DATETIME, -- Thời hạn hoàn thành, có thể để trống.
    completed_at DATETIME, -- Thời gian hoàn thành, có thể để trống.
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE, -- Khóa ngoại liên kết với Projects(project_id), xóa dự án sẽ xóa công việc.
    FOREIGN KEY (assigned_to) REFERENCES Users(user_id) ON DELETE SET NULL -- Khóa ngoại liên kết với Users(user_id), nếu người dùng bị xóa, công việc sẽ không còn người được giao.
);

-- Bảng TaskChecklists: Lưu danh sách subtask của công việc
CREATE TABLE TaskChecklists (
    checklist_id INT AUTO_INCREMENT PRIMARY KEY, -- ID subtask, tự động tăng, khóa chính.
    task_id INT NOT NULL, -- ID công việc mà subtask thuộc về, không được để trống.
    item_description VARCHAR(255) NOT NULL, -- Mô tả subtask, không được để trống, tối đa 255 ký tự.
    is_completed BOOLEAN DEFAULT FALSE, -- Trạng thái hoàn thành của subtask, mặc định là FALSE (chưa hoàn thành).
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo subtask, mặc định là thời gian hiện tại.
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE -- Khóa ngoại liên kết với Tasks(task_id), xóa công việc sẽ xóa subtask.
);

-- Bảng TaskComments: Lưu bình luận cho công việc
CREATE TABLE TaskComments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY, -- ID bình luận, tự động tăng, khóa chính.
    task_id INT NOT NULL, -- ID công việc mà bình luận thuộc về, không được để trống.
    user_id INT NOT NULL, -- ID người dùng viết bình luận, không được để trống.
    comment_text TEXT NOT NULL, -- Nội dung bình luận, không được để trống.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo bình luận, mặc định là thời gian hiện tại.
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE, -- Khóa ngoại liên kết với Tasks(task_id), xóa công việc sẽ xóa bình luận.
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE -- Khóa ngoại liên kết với Users(user_id), xóa người dùng sẽ xóa bình luận.
);

-- Bảng GitContributions: Lưu thông tin đóng góp GitHub cho dự án
CREATE TABLE GitContributions (
    contribution_id INT AUTO_INCREMENT PRIMARY KEY, -- ID đóng góp, tự động tăng, khóa chính.
    project_id INT NOT NULL, -- ID dự án mà đóng góp thuộc về, không được để trống.
    user_id INT NOT NULL, -- ID người dùng thực hiện đóng góp, không được để trống.
    commit_hash VARCHAR(40) NOT NULL, -- Mã hash của commit, không được để trống, tối đa 40 ký tự.
    commit_message TEXT, -- Thông điệp commit, có thể để trống.
    lines_added INT DEFAULT 0, -- Số dòng code thêm vào, mặc định là 0.
    lines_removed INT DEFAULT 0, -- Số dòng code bị xóa, mặc định là 0.
    commit_date DATETIME NOT NULL, -- Thời gian commit, không được để trống.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo bản ghi đóng góp, mặc định là thời gian hiện tại.
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE, -- Khóa ngoại liên kết với Projects(project_id), xóa dự án sẽ xóa đóng góp.
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE -- Khóa ngoại liên kết với Users(user_id), xóa người dùng sẽ xóa đóng góp.
);

-- Bảng PeerAssessments: Lưu đánh giá ngang hàng giữa các thành viên trong nhóm
CREATE TABLE PeerAssessments (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY, -- ID đánh giá, tự động tăng, khóa chính.
    group_id INT NOT NULL, -- ID nhóm mà đánh giá thuộc về, không được để trống.
    assessor_id INT NOT NULL, -- ID người đánh giá, không được để trống.
    assessee_id INT NOT NULL, -- ID người được đánh giá, không được để trống.
    deadline_score INT, -- Điểm tuân thủ thời hạn (1-5), có thể để trống.
    friendly_score INT, -- Điểm thân thiện (1-5), có thể để trống.
    quality_score INT, -- Điểm chất lượng công việc (1-5), có thể để trống.
    team_support_score INT, -- Điểm hỗ trợ nhóm (1-5), có thể để trống.
    responsibility_score INT, -- Điểm trách nhiệm (1-5), có thể để trống.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo đánh giá, mặc định là thời gian hiện tại.
    FOREIGN KEY (group_id) REFERENCES Groups(group_id) ON DELETE CASCADE, -- Khóa ngoại liên kết với Groups(group_id), xóa nhóm sẽ xóa đánh giá.
    FOREIGN KEY (assessor_id) REFERENCES Users(user_id) ON DELETE CASCADE, -- Khóa ngoại liên kết với Users(user_id), xóa người đánh giá sẽ xóa đánh giá.
    FOREIGN KEY (assessee_id) REFERENCES Users(user_id) ON DELETE CASCADE -- Khóa ngoại liên kết với Users(user_id), xóa người được đánh giá sẽ xóa đánh giá.
);

-- Bảng InstructorEvaluations: Lưu đánh giá từ giảng viên cho nhóm hoặc thành viên
CREATE TABLE InstructorEvaluations (
    evaluation_id INT AUTO_INCREMENT PRIMARY KEY, -- ID đánh giá, tự động tăng, khóa chính.
    group_id INT NOT NULL, -- ID nhóm mà đánh giá thuộc về, không được để trống.
    user_id INT NOT NULL, -- ID thành viên được đánh giá, không được để trống.
    instructor_id INT NOT NULL, -- ID giảng viên đánh giá, không được để trống.
    score INT, -- Điểm đánh giá (0-10), có thể để trống.
    comments TEXT, -- Nhận xét của giảng viên, có thể để trống.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo đánh giá, mặc định là thời gian hiện tại.
    FOREIGN KEY (group_id) REFERENCES Groups(group_id) ON DELETE CASCADE, -- Khóa ngoại liên kết với Groups(group_id), xóa nhóm sẽ xóa đánh giá.
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE, -- Khóa ngoại liên kết với Users(user_id), xóa thành viên sẽ xóa đánh giá.
    FOREIGN KEY (instructor_id) REFERENCES Users(user_id) ON DELETE CASCADE -- Khóa ngoại liên kết với Users(user_id), xóa giảng viên sẽ xóa đánh giá.
);

-- Bảng SystemConfigurations: Lưu cấu hình hệ thống
CREATE TABLE SystemConfigurations (
    config_id INT AUTO_INCREMENT PRIMARY KEY, -- ID cấu hình, tự động tăng, khóa chính.
    config_key VARCHAR(50) NOT NULL, -- Tên khóa cấu hình, không được để trống, tối đa 50 ký tự.
    config_value TEXT NOT NULL, -- Giá trị cấu hình, không được để trống.
    description TEXT, -- Mô tả cấu hình, có thể để trống.
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian cập nhật cấu hình, mặc định là thời gian hiện tại.
    updated_by INT, -- ID người dùng cập nhật cấu hình, có thể để trống.
    FOREIGN KEY (updated_by) REFERENCES Users(user_id) ON DELETE SET NULL -- Khóa ngoại liên kết với Users(user_id), nếu người dùng bị xóa, updated_by sẽ thành NULL.
);

-- Bảng PasswordResetTokens: Lưu token để đặt lại mật khẩu
CREATE TABLE PasswordResetTokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY, -- ID token, tự động tăng, khóa chính.
    user_id INT NOT NULL, -- ID người dùng liên quan đến token, không được để trống.
    token VARCHAR(255) NOT NULL, -- Token đặt lại mật khẩu, không được để trống, tối đa 255 ký tự.
    expires_at DATETIME NOT NULL, -- Thời gian hết hạn của token, không được để trống.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo token, mặc định là thời gian hiện tại.
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE -- Khóa ngoại liên kết với Users(user_id), xóa người dùng sẽ xóa token.
);

-- Trigger kiểm tra status = 'Done': Đảm bảo tất cả subtask hoàn thành trước khi đặt status = 'Done'
DELIMITER //

CREATE TRIGGER before_task_status_update
BEFORE UPDATE ON Tasks -- Trigger được kích hoạt trước khi cập nhật bản ghi trong bảng Tasks.
FOR EACH ROW
BEGIN
    IF NEW.status = 'Done' THEN -- Kiểm tra nếu trạng thái mới được đặt là 'Done'.
        IF EXISTS (
            SELECT 1
            FROM TaskChecklists
            WHERE task_id = NEW.task_id
            AND is_completed = FALSE -- Kiểm tra xem có subtask nào chưa hoàn thành không.
        ) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot set status to Done: Not all subtasks are completed.'; -- Báo lỗi nếu có subtask chưa hoàn thành.
        END IF;
    END IF;
END //

DELIMITER ;

-- Trigger tự động cập nhật progress_percentage khi status thay đổi
DELIMITER //

CREATE TRIGGER after_task_status_update
AFTER UPDATE ON Tasks -- Trigger được kích hoạt sau khi cập nhật bản ghi trong bảng Tasks.
FOR EACH ROW
BEGIN
    DECLARE calculated_percentage INT; -- Biến để lưu tiến độ được tính toán.
    
    IF NEW.status = 'To-Do' THEN
        SET calculated_percentage = 0; -- Nếu trạng thái là 'To-Do', tiến độ là 0%.
    ELSEIF NEW.status = 'Done' THEN
        SET calculated_percentage = 100; -- Nếu trạng thái là 'Done', tiến độ là 100%.
    ELSEIF NEW.status = 'In-Progress' THEN
        SET calculated_percentage = (
            SELECT COALESCE(
                ROUND((SUM(CASE WHEN tc.is_completed = TRUE THEN 1 ELSE 0 END) / COUNT(*)) * 100),
                0
            )
            FROM TaskChecklists tc
            WHERE tc.task_id = NEW.task_id -- Tính tiến độ dựa trên tỷ lệ subtask hoàn thành (nếu có).
        );
    END IF;
    
    UPDATE Tasks
    SET progress_percentage = calculated_percentage
    WHERE task_id = NEW.task_id; -- Cập nhật cột progress_percentage trong bảng Tasks.
END //

DELIMITER ;

-- Trigger tự động cập nhật progress_percentage khi subtask thay đổi
DELIMITER //

CREATE TRIGGER after_checklist_update
AFTER UPDATE ON TaskChecklists -- Trigger được kích hoạt sau khi cập nhật bản ghi trong bảng TaskChecklists.
FOR EACH ROW
BEGIN
    DECLARE task_status ENUM('To-Do', 'In-Progress', 'Done'); -- Biến lưu trạng thái của công việc.
    DECLARE calculated_percentage INT; -- Biến lưu tiến độ được tính toán.
    
    SELECT status INTO task_status
    FROM Tasks
    WHERE task_id = NEW.task_id; -- Lấy trạng thái hiện tại của công việc.
    
    IF task_status = 'To-Do' THEN
        SET calculated_percentage = 0; -- Nếu trạng thái là 'To-Do', tiến độ là 0%.
    ELSEIF task_status = 'Done' THEN
        SET calculated_percentage = 100; -- Nếu trạng thái là 'Done', tiến độ là 100%.
    ELSEIF task_status = 'In-Progress' THEN
        SET calculated_percentage = (
            SELECT COALESCE(
                ROUND((SUM(CASE WHEN tc.is_completed = TRUE THEN 1 ELSE 0 END) / COUNT(*)) * 100),
                0
            )
            FROM TaskChecklists tc
            WHERE tc.task_id = NEW.task_id -- Tính tiến độ dựa trên tỷ lệ subtask hoàn thành.
        );
    END IF;
    
    UPDATE Tasks
    SET progress_percentage = calculated_percentage
    WHERE task_id = NEW.task_id; -- Cập nhật cột progress_percentage trong bảng Tasks.
END //

DELIMITER ;

-- Chỉ mục để tối ưu hiệu suất
CREATE INDEX idx_users_email ON Users(email); -- Tạo chỉ mục trên cột email của bảng Users, tối ưu truy vấn tìm kiếm theo email.
CREATE INDEX idx_classes_instructor_id ON Classes(instructor_id); -- Tạo chỉ mục trên cột instructor_id của bảng Classes, tối ưu truy vấn theo giảng viên.
CREATE INDEX idx_tasks_project_id ON Tasks(project_id); -- Tạo chỉ mục trên cột project_id của bảng Tasks, tối ưu truy vấn theo dự án.
CREATE INDEX idx_tasks_assigned_to ON Tasks(assigned_to); -- Tạo chỉ mục trên cột assigned_to của bảng Tasks, tối ưu truy vấn theo người được giao.
CREATE INDEX idx_git_contributions_project_id ON GitContributions(project_id); -- Tạo chỉ mục trên cột project_id của bảng GitContributions, tối ưu truy vấn theo dự án.
CREATE INDEX idx_git_contributions_user_id ON GitContributions(user_id); -- Tạo chỉ mục trên cột user_id của bảng GitContributions, tối ưu truy vấn theo người dùng.
CREATE INDEX idx_peer_assessments_group_id ON PeerAssessments(group_id); -- Tạo chỉ mục trên cột group_id của bảng PeerAssessments, tối ưu truy vấn theo nhóm.
CREATE INDEX idx_instructor_evaluations_group_id ON InstructorEvaluations(group_id); -- Tạo chỉ mục trên cột group_id của bảng InstructorEvaluations, tối ưu truy vấn theo nhóm.
