-- Tạo cơ sở dữ liệu
DROP DATABASE IF EXISTS project_management;
CREATE DATABASE project_management;
USE project_management;

-- Bảng Users: Lưu thông tin người dùng (sinh viên, giảng viên, quản trị viên)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Student', 'Instructor', 'Admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
    is_active BOOLEAN DEFAULT TRUE,
    avatar VARCHAR(255)
);

-- Bảng Classes: Lưu thông tin lớp học
CREATE TABLE Classes (
    class_id INT PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL,
    instructor_id INT NOT NULL,
    semester VARCHAR(10),
    secret_code VARCHAR(10) UNIQUE, -- Thêm trường mã bí mật, giới hạn 10 ký tự, duy nhất
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES Users(user_id) ON DELETE RESTRICT
);

-- Bảng Groups: Lưu thông tin nhóm trong lớp
CREATE TABLE `Groups` (
    group_id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(50) NOT NULL,
    class_id INT NOT NULL,
    leader_id INT NOT NULL,
    group_number INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE CASCADE,
    FOREIGN KEY (leader_id) REFERENCES Users(user_id) ON DELETE RESTRICT,
    CONSTRAINT unique_group_number UNIQUE (class_id, group_number)
);

-- Bảng GroupMembers: Lưu thông tin thành viên của nhóm
CREATE TABLE GroupMembers (
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES `Groups`(group_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Bảng Projects: Lưu thông tin dự án, liên kết trực tiếp với nhóm
CREATE TABLE Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    group_id INT NOT NULL UNIQUE,
    description TEXT,
    tools_used TEXT,
    status ENUM('Ongoing', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Ongoing',
    github_repo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES `Groups`(group_id) ON DELETE CASCADE
);

-- Bảng Sprints: Lưu thông tin sprint trong dự án
CREATE TABLE Sprints (
    sprint_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    sprint_number INT NOT NULL,
    sprint_name VARCHAR(100),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE,
    CONSTRAINT unique_sprint_number UNIQUE (project_id, sprint_number)
);

-- Bảng Tasks: Lưu thông tin công việc trong sprint
CREATE TABLE Tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    sprint_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    assigned_to INT,
    status ENUM('To-Do', 'In-Progress', 'Completed') NOT NULL DEFAULT 'To-Do',
    progress_percentage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME,
    completed_at DATETIME,
    FOREIGN KEY (sprint_id) REFERENCES Sprints(sprint_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- Bảng TaskChecklists: Lưu danh sách subtask của công việc
CREATE TABLE TaskChecklists (
    checklist_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    item_description VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE
);

-- Bảng TaskComments: Lưu bình luận cho công việc
CREATE TABLE TaskComments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Bảng GitContributions: Lưu thông tin đóng góp GitHub cho dự án
CREATE TABLE GitContributions (
    contribution_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    commit_hash VARCHAR(40) NOT NULL,
    commit_message TEXT,
    lines_added INT DEFAULT 0,
    lines_removed INT DEFAULT 0,
    commit_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Bảng PeerAssessments: Lưu đánh giá ngang hàng giữa các thành viên trong nhóm
CREATE TABLE PeerAssessments (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    assessor_id INT NOT NULL,
    assessee_id INT NOT NULL,
    deadline_score INT,
    friendly_score INT,
    quality_score INT,
    team_support_score INT,
    responsibility_score INT,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES `Groups`(group_id) ON DELETE CASCADE,
    FOREIGN KEY (assessor_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (assessee_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Bảng InstructorEvaluations: Lưu đánh giá từ giảng viên cho nhóm hoặc thành viên
CREATE TABLE InstructorEvaluations (
    evaluation_id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    instructor_id INT NOT NULL,
    score INT,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES `Groups`(group_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Bảng SystemConfigurations: Lưu cấu hình hệ thống
CREATE TABLE SystemConfigurations (
    config_id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(50) NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    FOREIGN KEY (updated_by) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- Bảng PasswordResetTokens: Lưu token để đặt lại mật khẩu
CREATE TABLE PasswordResetTokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Trigger tự động gán group_number
DELIMITER //
CREATE TRIGGER before_group_insert
BEFORE INSERT ON `Groups`
FOR EACH ROW
BEGIN
    SET NEW.group_number = (
        SELECT COALESCE(MAX(group_number), 0) + 1
        FROM `Groups`
        WHERE class_id = NEW.class_id
    );
END //
DELIMITER ;

-- Trigger tự động gán sprint_number
DELIMITER //
CREATE TRIGGER before_sprint_insert
BEFORE INSERT ON Sprints
FOR EACH ROW
BEGIN
    SET NEW.sprint_number = (
        SELECT COALESCE(MAX(sprint_number), 0) + 1
        FROM Sprints
        WHERE project_id = NEW.project_id
    );
END //
DELIMITER ;

-- Trigger đảm bảo sinh viên chỉ tham gia 1 nhóm trong 1 lớp
DELIMITER //
CREATE TRIGGER before_group_member_insert
BEFORE INSERT ON GroupMembers
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1
        FROM GroupMembers gm
        JOIN `Groups` g ON gm.group_id = g.group_id
        WHERE gm.user_id = NEW.user_id
        AND g.class_id = (SELECT class_id FROM `Groups` WHERE group_id = NEW.group_id)
        AND gm.group_id != NEW.group_id
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Sinh viên chỉ được tham gia tối đa 1 nhóm trong một lớp';
    END IF;
END //
DELIMITER ;

-- Trigger kiểm tra status = 'Completed'
DELIMITER //
CREATE TRIGGER before_task_status_update
BEFORE UPDATE ON Tasks
FOR EACH ROW
BEGIN
    IF NEW.status = 'Completed' THEN
        IF EXISTS (
            SELECT 1
            FROM TaskChecklists
            WHERE task_id = NEW.task_id
            AND is_completed = FALSE
        ) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot set status to Completed: Not all subtasks are completed.';
        END IF;
        SET NEW.completed_at = NOW();
    ELSE
        SET NEW.completed_at = NULL;
    END IF;
END //
DELIMITER ;

-- Trigger tự động cập nhật progress_percentage và status khi subtask thay đổi
DELIMITER //
CREATE TRIGGER after_checklist_update
AFTER UPDATE ON TaskChecklists
FOR EACH ROW
BEGIN
    DECLARE calculated_percentage INT;
    DECLARE task_status ENUM('To-Do', 'In-Progress', 'Completed');
    DECLARE subtask_count INT;
    
    -- Get the current task status
    SELECT status INTO task_status
    FROM Tasks
    WHERE task_id = NEW.task_id;
    
    -- Count total subtasks for the task
    SELECT COUNT(*) INTO subtask_count
    FROM TaskChecklists
    WHERE task_id = NEW.task_id;
    
    -- Calculate progress percentage based on checklist completion
    SET calculated_percentage = (
        SELECT COALESCE(
            ROUND((SUM(CASE WHEN tc.is_completed = TRUE THEN 1 ELSE 0 END) / COUNT(*)) * 100),
            0
        )
        FROM TaskChecklists tc
        WHERE tc.task_id = NEW.task_id
    );
    
    -- Update task status and progress percentage
    IF subtask_count = 1 AND calculated_percentage = 100 THEN
        -- Single subtask case: Go directly to Completed when subtask is completed
        UPDATE Tasks
        SET status = 'Completed',
            progress_percentage = 100,
            completed_at = NOW()
        WHERE task_id = NEW.task_id;
    ELSEIF task_status = 'To-Do' AND calculated_percentage > 0 THEN
        UPDATE Tasks
        SET status = 'In-Progress',
            progress_percentage = calculated_percentage
        WHERE task_id = NEW.task_id;
    ELSEIF task_status = 'In-Progress' AND calculated_percentage = 100 THEN
        UPDATE Tasks
        SET status = 'Completed',
            progress_percentage = 100,
            completed_at = NOW()
        WHERE task_id = NEW.task_id;
    ELSEIF task_status = 'Completed' AND calculated_percentage < 100 THEN
        UPDATE Tasks
        SET status = 'In-Progress',
            progress_percentage = calculated_percentage,
            completed_at = NULL
        WHERE task_id = NEW.task_id;
    ELSEIF task_status = 'In-Progress' AND calculated_percentage = 0 THEN
        UPDATE Tasks
        SET status = 'To-Do',
            progress_percentage = 0
        WHERE task_id = NEW.task_id;
    ELSE
        UPDATE Tasks
        SET progress_percentage = calculated_percentage
        WHERE task_id = NEW.task_id;
    END IF;
END //
DELIMITER ;

-- Chỉ mục để tối ưu hiệu suất
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_classes_instructor_id ON Classes(instructor_id);
CREATE INDEX idx_tasks_sprint_id ON Tasks(sprint_id);
CREATE INDEX idx_tasks_assigned_to ON Tasks(assigned_to);
CREATE INDEX idx_git_contributions_project_id ON GitContributions(project_id);
CREATE INDEX idx_git_contributions_user_id ON GitContributions(user_id);
CREATE INDEX idx_peer_assessments_group_id ON PeerAssessments(group_id);
CREATE INDEX idx_instructor_evaluations_group_id ON InstructorEvaluations(group_id);