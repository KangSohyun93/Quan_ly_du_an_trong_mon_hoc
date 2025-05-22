USE project_management;

-- Tạm thời tắt kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 0;

-- TRUNCATE theo thứ tự phù hợp với quan hệ khóa ngoại
TRUNCATE TABLE PasswordResetTokens;
TRUNCATE TABLE SystemConfigurations;
TRUNCATE TABLE InstructorEvaluations;
TRUNCATE TABLE PeerAssessments;
TRUNCATE TABLE GitContributions;
TRUNCATE TABLE TaskComments;
TRUNCATE TABLE TaskChecklists;
TRUNCATE TABLE Tasks;
TRUNCATE TABLE Sprints;
TRUNCATE TABLE Projects;
TRUNCATE TABLE GroupMembers;
TRUNCATE TABLE ClassMembers;
TRUNCATE TABLE `Groups`;
TRUNCATE TABLE Classes;
TRUNCATE TABLE Users;

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;