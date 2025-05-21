const db = require('../config/db-connect');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 10,
            search = '',
            role = '',
            status = '',
            startDate = '',
            endDate = '',
            sortBy = 'created_at',
            sortOrder = 'desc'
        } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        let queryParams = [];
        let whereClauses = [];

        if (search) {
            whereClauses.push("(username LIKE ? OR email LIKE ?)");
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        if (role) {
            whereClauses.push("role = ?");
            queryParams.push(role);
        }

        if (status) {
            whereClauses.push("is_active = ?");
            queryParams.push(status === 'active');
        }

        if (startDate) {
            const actualEndDate = endDate || '9999-12-31'; // Nếu endDate rỗng, coi như đến cuối
            whereClauses.push("DATE(created_at) BETWEEN ? AND ?");
            queryParams.push(startDate, actualEndDate);
        } else if (endDate) {
            // Nếu chỉ có endDate, có thể hiểu là lấy từ đầu đến endDate
            whereClauses.push("DATE(created_at) <= ?");
            queryParams.push(endDate);
        }

        const whereString = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

       // Câu lệnh SQL để lấy user (sắp xếp theo created_at giảm dần)
        const usersSql = `
            SELECT user_id, username, email, role, created_at, is_active
            FROM Users
            ${whereString}
            ORDER BY created_at ASC
            LIMIT ? OFFSET ?
        `;
        const usersParams = [...queryParams, limit, offset];
        const [users] = await db.query(usersSql, usersParams);

        // Câu lệnh SQL để đếm tổng số user (cho phân trang)
        const countSql = `SELECT COUNT(*) as totalUsers FROM Users ${whereString}`;
        const [countResult] = await db.query(countSql, queryParams);
        const totalUsers = countResult[0].totalUsers;
        const totalPages = Math.ceil(totalUsers / limit);

        res.json({
            users,
            pagination: {
                currentPage: page,
                totalPages,
                totalUsers,
                limit,
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({ message: "UserID không hợp lệ." });
        }

        const [result] = await db.query("DELETE FROM Users WHERE user_id = ?", [parseInt(userId)]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy người dùng để xóa hoặc người dùng đã được xóa." });
        }

        res.json({ message: "Người dùng đã được xóa thành công." });
    } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        // Xử lý lỗi cụ thể nếu người dùng không thể xóa do ràng buộc khóa ngoại
        if (error.code === 'ER_ROW_IS_REFERENCED_2') { // Mã lỗi của MySQL khi có khóa ngoại tham chiếu
            return res.status(400).json({ message: "Không thể xóa người dùng này vì họ đang liên kết với các dữ liệu khác (ví dụ: là giảng viên của lớp, trưởng nhóm,...). Vui lòng kiểm tra lại." });
        }
        res.status(500).json({ message: "Lỗi máy chủ nội bộ khi xóa người dùng." });
    }
};

exports.getUserRoles = async (req, res) => {
    try {
        const roles = ['Student', 'Instructor', 'Admin']; // Danh sách các vai trò
        res.json({ roles });
    } catch (error) {
        console.error('Error fetching user roles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role, avatar } = req.body; // "Full name" sẽ là "username"
        
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin." });
        }

        const [existingUser] = await db.query("SELECT user_id FROM Users WHERE email = ?", [email]);

        if (existingUser.length > 0) { 
            return res.status(400).json({ message: "Email đã tồn tại." });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            email,
            password: hashedPassword,
            role,
            avatar: avatar || null, // Có thể là null nếu không có ảnh
            is_active: true // Mặc định là true
        };

        const [result] = await db.query("INSERT INTO Users SET ?", newUser);
        const insertedUserId = result.insertId;

        const [createdUser] = await db.query("SELECT user_id, username, email, role, created_at, is_active FROM Users WHERE user_id = ?", [insertedUserId]);
        res.status(201).json({
            message: "Người dùng đã được tạo thành công.",
            user: createdUser[0]
        });
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email đã tồn tại." });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.GetUserById = async (req, res) => {
    try {
        const { userId} = req.params
        if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({ message: "UserID không hợp lệ." });
        }
        
        const [users] = await db.query("SELECT user_id, username, email, role, created_at, is_active FROM Users WHERE user_id = ?", [parseInt(userId)]);

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const {role, is_active} = req.body;
        if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({ message: "Invalid UserID." });
        }

        if (role === undefined || is_active === undefined) {
            return res.status(400).json({ message: "No update fields provided (role or is_active)" });
        }

        const [currentUserArr] = await db.query("SELECT role, is_active FROM Users WHERE user_id = ?", [parseInt(userId)]);
        if (currentUserArr.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        const currentUser = currentUserArr[0];

        let updateFields = {};
        let queryParams = [];

        if (role !== undefined && role !== currentUser.role) {
            const validRoles = ['Student', 'Instructor', 'Admin'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: `Invalid role value. Allowed roles are: ${validRoles.join(', ')}.` });
            }
            updateFields.role = role;
        }

        if (is_active !== undefined && typeof is_active === 'boolean' && is_active !== currentUser.is_active) {
            updateFields.is_active = is_active;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(200).json({ message: "No changes detected or new values are same as current.", user: currentUser });
        }

        const setClauses = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
        queryParams = [...Object.values(updateFields), parseInt(userId)];

        const sql = `UPDATE Users SET ${setClauses} WHERE user_id = ?`;
        const [result] = await db.query(sql, queryParams);

        if (result.affectedRows === 0) {
            // Điều này không nên xảy ra nếu đã kiểm tra user tồn tại ở trên
            return res.status(404).json({ message: "User not found or no changes made." });
        }

        // Lấy lại thông tin user đã cập nhật
        const [updatedUser] = await db.query("SELECT user_id, username, email, role, created_at, is_active, avatar FROM Users WHERE user_id = ?", [parseInt(userId)]);
        res.json({ message: "User updated successfully.", user: updatedUser[0] });
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email already exists." });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};