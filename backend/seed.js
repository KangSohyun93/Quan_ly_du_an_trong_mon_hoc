const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
const Group = require("./models/GroupModel");
const Project = require("./models/ProjectModel");
const GroupMember = require("./models/MemberGroupModel");
const Class = require("./models/ClassModel");
const User = require("./models/UserModel");

// Hàm seed dữ liệu
async function seed() {
  try {
    await mongoose.connection.dropDatabase();

    // Tạo 30 sinh viên
    const students = await Promise.all(
      Array.from({ length: 30 }, async (_, i) => {
        return await User.create({
          username: `Student${i + 1}`,
          email: `student${i + 1}@example.com`,
          password: await bcrypt.hash(`password${i + 1}`, 10),
          role: "Student",
          is_active: true,
          avatar: `/uploads/student${i + 1}.jpg`,
        });
      })
    );

    // Tạo giảng viên
    const profSmith = await User.create({
      username: "ProfSmith",
      email: "smith@example.com",
      password: await bcrypt.hash("password31", 10),
      role: "Instructor",
      is_active: true,
      avatar: "/uploads/smith.jpg",
    });

    const profJones = await User.create({
      username: "ProfJones",
      email: "jones@example.com",
      password: await bcrypt.hash("password32", 10),
      role: "Instructor",
      is_active: true,
      avatar: "/uploads/jones.jpg",
    });

    const profBrown = await User.create({
      username: "ProfBrown",
      email: "brown@example.com",
      password: await bcrypt.hash("password33", 10),
      role: "Instructor",
      is_active: true,
      avatar: "/uploads/brown.jpg",
    });

    const admin = await User.create({
      username: "Admin1",
      email: "admin1@example.com",
      password: await bcrypt.hash("password34", 10),
      role: "Admin",
      is_active: true,
      avatar: "/uploads/admin1.jpg",
    });

    // Tạo lớp học
    const classes = await Class.insertMany([
      {
        class_id: 100001,
        className: "Công nghệ phần mềm",
        instructor: profSmith._id,
        semester: "2025.1",
        secretCode: "SE2025",
      },
      {
        class_id: 100002,
        className: "Lập trình web",
        instructor: profJones._id,
        semester: "2025.1",
        secretCode: "WEB2025",
      },
      {
        class_id: 100003,
        className: "Cấu trúc dữ liệu",
        instructor: profBrown._id,
        semester: "2025.2",
        secretCode: "DS2025",
      },
      {
        class_id: 100004,
        className: "Hệ điều hành",
        instructor: profSmith._id,
        semester: "2025.2",
        secretCode: "OS2025",
      },
      {
        class_id: 100005,
        className: "Trí tuệ nhân tạo",
        instructor: profJones._id,
        semester: "2025.2",
        secretCode: "AI2025",
      },
    ]);

    // Tạo nhóm và thành viên nhóm
    const groupData = [
      {
        groupName: "Nhóm 1",
        groupNumber: 1,
        classId: classes[0],
        leader: students[0],
        members: [0, 1, 2, 3],
      },
      {
        groupName: "Nhóm 2",
        groupNumber: 2,
        classId: classes[0],
        leader: students[4],
        members: [4, 5, 6, 7],
      },
      {
        groupName: "Nhóm 3",
        groupNumber: 3,
        classId: classes[1],
        leader: students[6],
        members: [6, 7, 8, 9],
      },
      {
        groupName: "Nhóm 4",
        groupNumber: 4,
        classId: classes[1],
        leader: students[10],
        members: [10, 11, 12, 13],
      },
      {
        groupName: "Nhóm 5",
        groupNumber: 5,
        classId: classes[2],
        leader: students[12],
        members: [12, 13, 14, 15],
      },
      {
        groupName: "Nhóm 6",
        groupNumber: 6,
        classId: classes[2],
        leader: students[16],
        members: [16, 17, 18, 19],
      },
      {
        groupName: "Nhóm 7",
        groupNumber: 7,
        classId: classes[3],
        leader: students[18],
        members: [18, 19, 20, 21],
      },
      {
        groupName: "Nhóm 8",
        groupNumber: 8,
        classId: classes[3],
        leader: students[22],
        members: [22, 23, 24, 25],
      },
      {
        groupName: "Nhóm 9",
        groupNumber: 9,
        classId: classes[4],
        leader: students[24],
        members: [24, 25, 26, 27],
      },
      {
        groupName: "Nhóm 10",
        groupNumber: 10,
        classId: classes[4],
        leader: students[28],
        members: [28, 29, 0, 1],
      },
    ];

    const createdGroups = [];

    for (let i = 0; i < groupData.length; i++) {
      const group = await Group.create({
        groupName: groupData[i].groupName,
        classId: groupData[i].classId._id,
        leader: groupData[i].leader._id,
        groupNumber: groupData[i].groupNumber,
      });

      createdGroups.push(group); // lưu lại để tra cứu sau

      await GroupMember.insertMany(
        groupData[i].members.map((index) => ({
          groupId: group._id,
          userId: students[index]._id,
        }))
      );
    }

    const projectData = [
      {
        projectName: "Hệ thống quản lý thư viện",
        groupNumber: 1,
        description: "Xây dựng hệ thống quản lý thư viện trực tuyến",
        toolsUsed: "React, Node.js, MySQL",
        status: "Ongoing",
        githubRepoUrl: "https://github.com/group1/library-system",
      },
      {
        projectName: "Ứng dụng đặt vé xem phim",
        groupNumber: 2,
        description: "Ứng dụng đặt vé xem phim trên mobile",
        toolsUsed: "Flutter, Firebase",
        status: "Completed",
        githubRepoUrl: "https://github.com/group2/movie-ticket",
      },
      {
        projectName: "Website bán hàng",
        groupNumber: 3,
        description: "Website thương mại điện tử bán hàng",
        toolsUsed: "Vue.js, Express, MongoDB",
        status: "Ongoing",
        githubRepoUrl: "https://github.com/group3/ecommerce",
      },
      {
        projectName: "Ứng dụng ghi chú",
        groupNumber: 4,
        description: "Ứng dụng ghi chú đơn giản",
        toolsUsed: "React Native, SQLite",
        status: "Cancelled",
        githubRepoUrl: "https://github.com/group4/notes-app",
      },
      {
        projectName: "Phân tích dữ liệu sinh viên",
        groupNumber: 5,
        description: "Phân tích dữ liệu sinh viên bằng Python",
        toolsUsed: "Python, Pandas, Matplotlib",
        status: "Ongoing",
        githubRepoUrl: "https://github.com/group5/student-analysis",
      },
      {
        projectName: "Hệ thống quản lý kho",
        groupNumber: 6,
        description: "Hệ thống quản lý kho hàng",
        toolsUsed: "Angular, Spring Boot, PostgreSQL",
        status: "Ongoing",
        githubRepoUrl: "https://github.com/group6/inventory-system",
      },
      {
        projectName: "Ứng dụng học tập",
        groupNumber: 7,
        description: "Ứng dụng hỗ trợ học tập",
        toolsUsed: "React, Django, SQLite",
        status: "Completed",
        githubRepoUrl: "https://github.com/group7/learning-app",
      },
      {
        projectName: "Hệ điều hành mini",
        groupNumber: 8,
        description: "Xây dựng hệ điều hành mini",
        toolsUsed: "C, Assembly",
        status: "Ongoing",
        githubRepoUrl: "https://github.com/group8/mini-os",
      },
      {
        projectName: "AI nhận diện hình ảnh",
        groupNumber: 9,
        description: "Ứng dụng AI nhận diện hình ảnh",
        toolsUsed: "Python, TensorFlow, OpenCV",
        status: "Ongoing",
        githubRepoUrl: "https://github.com/group9/image-recognition",
      },
      {
        projectName: "Chatbot thông minh",
        groupNumber: 10,
        description: "Xây dựng chatbot thông minh",
        toolsUsed: "Python, Flask, NLTK",
        status: "Ongoing",
        githubRepoUrl: "https://github.com/group10/smart-chatbot",
      },
    ];

    for (const data of projectData) {
      const group = createdGroups.find(
        (g) => g.groupNumber === data.groupNumber
      );
      if (!group) {
        console.warn(`Không tìm thấy nhóm số ${data.groupNumber}`);
        continue;
      }

      await Project.create({
        projectName: data.projectName,
        groupId: group._id,
        description: data.description,
        toolsUsed: data.toolsUsed,
        status: data.status,
        githubRepoUrl: data.githubRepoUrl,
      });
    }

    console.log("✅ Seed dữ liệu thành công!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Lỗi seed:", err);
  }
}

seed();
