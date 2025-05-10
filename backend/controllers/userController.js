const db = require('../config/db-connect');

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
            ORDER BY created_at DESC
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