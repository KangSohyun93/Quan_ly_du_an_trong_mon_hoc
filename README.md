Đề tài: Quản lý dự án trong môn học

Thành viên: 
Hoàng Hương Giang   20225619 
Nguyễn Ngọc Lan     20225730 
Thân Cát Ngọc Lan   20225646
Nguyễn Thị Nhung    20225754 
Bùi Thu Trang       20225938

Hướng dẫn cài đặt, triển khai sản phẩm từ mã nguồn
I. Hướng dẫn cài đặt
Yêu cầu đã cài đặt Node.js và npm trên máy tính.
Bước 1: Tải mã nguồn
Clone mã nguồn từ kho lưu trữ (repository) về máy tính bằng lệnh sau:
git clone https://github.com/KangSohyun93/Quan_ly_du_an_trong_mon_hoc.git

Bước 2: Cài đặt Backend
2.1. Di chuyển vào thư mục backend
cd backend
 
2.2. Cài đặt gói nodemon để tự động khởi động lại server khi mã nguồn thay đổi:
npm install --save-dev nodemon

2.3. Cài đặt các phụ thuộc khác:
npm install

Bước 3: Cài đặt Frontend
3.1. Di chuyển vào thư mục frontend
cd frontend
 
2.2. Cài đặt gói react-scripts để chạy ứng dụng React:
npm install react-scripts --save

2.3. Cài đặt các phụ thuộc khác:
npm install

Bước 4: Tạo Database
Mở MySQL trên máy và thực hiện chạy lần lượt các file trong thư mục sql: create_table.sql -> insert_table.sql
Bước 5: Cấu hình file môi trường (.env)
5.1. Tạo file .env trong thư mục backend
5.2. Thêm thông tin cấu hình sau vào file .env (Thay bằng các giá trị thực tế)
DB_HOST=<Địa_chỉ_host_cơ_sở_dữ_liệu>
DB_USER=<Tên_người_dùng_cơ_sở_dữ_liệu>
DB_PASSWORD=<Mật_khẩu_cơ_sở_dữ_liệu>
DB_NAME=project_management
DB_PORT=3306
PORT=5000


II.	Hướng dẫn lấy token từ GitHub và add vào dự án
Bước 1: Lấy token từ GitHub
1.1. Vào Setting -> Chọn Developer Settings (Ở sidebar bên trái)
1.2. Chọn Personal access tokens -> Tokens (classic)
1.3. Tạo token mới (Generate new token classic)
-	Điền note (Lý do sử dụng)
-	Chọn hạn sử dụng (nếu cần)
-	Tick repo.
-   Xác nhận Generate token.
-   Copy mã token.

Bước 2: Add vào dự án
2.1. Tạo file .github.env trong thư mục backend
2.2. Thêm thông tin cấu hình sau vào file .github.env (Thay bằng các giá trị thực tế)
GITHUB_TOKEN=<Github_Token_của_bạn>
PORT=5000


III. Hướng dẫn chạy sản phẩm
Bước 1: Chạy Backend
cd backend
npm run dev
 
Bước 2: Chạy Frontend
cd frontend
npm start

IV.	Một số tài khoản để test thử hệ thống
            Tài khoản	            Mật khẩu
Admin	    admin1@example.com	    hashed_password_34
Instructor	smith@example.com	    hashed_password_31
Student	    student1@example.com	hashed_password_1
Leader	    student4@example.com	hashed_password_4