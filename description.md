# TÀI LIỆU ĐẶC TẢ DỰ ÁN: SOIGIA

## 1. Mô tả dự án
**SoiGia** là một ứng dụng web (nền tảng tiếng Việt) được thiết kế để theo dõi và so sánh giá cả của các loại sản phẩm đa dạng giữa nhiều cửa hàng, đại lý hoặc trạm xăng khác nhau. Mục tiêu của hệ thống là mang lại sự minh bạch về giá cả, giúp người dùng dễ dàng tham khảo và đưa ra quyết định mua sắm tối ưu nhất.

---

## 2. Luồng người dùng chính (Main Flow)
Trải nghiệm người dùng được thiết kế liền mạch qua các bước sau:

1. **Trang chủ:** Từ giao diện trang chủ, người dùng thao tác nhấp chọn mục **Danh mục** được đặt trên thanh điều hướng (Header).
2. **Chọn danh mục hàng hóa:** Hệ thống hiển thị các danh mục lớn (Level 1) như: *Thực phẩm, Xăng dầu, Thời trang...* Khi người dùng nhấp vào một danh mục, giao diện sẽ chuyển sang trang danh sách các sản phẩm thuộc danh mục đó.
3. **Lọc sản phẩm (Filter):** Tại trang danh sách sản phẩm, người dùng có thể sử dụng bộ lọc theo danh mục con (Category Level 2) để thu hẹp tìm kiếm. 
   * *Ví dụ:* Trong danh mục "Thực phẩm", có thể lọc chi tiết theo *Thịt, Hải sản, Rau củ...*
4. **Xem chi tiết & So sánh giá:** Sau khi chọn một sản phẩm cụ thể, người dùng được dẫn đến trang chi tiết của sản phẩm đó. Tại đây, hệ thống sẽ hiển thị một danh sách trực quan đối chiếu giá bán của chính sản phẩm đó tại nhiều cửa hàng/nguồn bán khác nhau.

---

## 3. Ngăn xếp Công nghệ (Tech Stack) & Kiến trúc
Hệ thống sử dụng kiến trúc hiện đại, phân tách rõ ràng giữa frontend, backend và các tác vụ chạy ngầm:

### 3.1. Giao diện (Front-end)
* **Framework / Thư viện:** ReactJS
* **Ngôn ngữ:** TypeScript
* **Build tool:** Vite (đảm bảo tốc độ khởi tạo và build cực nhanh)

### 3.2. Hệ thống Máy chủ (Back-end)
* **Backend chính:** Node.js (Xử lý API phục vụ frontend, logic nghiệp vụ web và auth). Hệ thống áp dụng **Kiến trúc phân tầng (Layered Architecture)** chặt chẽ nhằm tách biệt mã nguồn thành 4 tầng trách nhiệm rõ ràng:
  * **`Routes` (Tầng định tuyến):** Tiếp nhận các HTTP request từ client (Front-end) và chuyển hướng yêu cầu đến đúng Controller xử lý.
  * **`Controllers` (Tầng điều khiển):** Tiếp nhận dữ liệu từ Routes, thực hiện kiểm tra tính hợp lệ sơ bộ của dữ liệu đầu vào (Validation), gọi Service xử lý và trả về phản hồi HTTP (Response) cho Client.
  * **`Services` (Tầng nghiệp vụ):** Nơi tập trung toàn bộ logic nghiệp vụ (Business Logic) của ứng dụng SoiGia (ví dụ: tính toán chênh lệch giá, xử lý logic cache). Đây là cầu nối giữa Controller và Repository.
  * **`Repositories` (Tầng dữ liệu):** Lớp duy nhất có quyền tương tác trực tiếp với Cơ sở dữ liệu (PostgreSQL) thông qua các câu lệnh truy vấn hoặc ORM để thực hiện các thao tác đọc/ghi dữ liệu.
* **Worker / Crawler:** Python (Chuyên trách việc chạy các script tự động để cào/thu thập dữ liệu giá từ các website nguồn).

### 3.3. Cơ sở dữ liệu & Middleware (Database & Middleware)
* **Cơ sở dữ liệu chính:** PostgreSQL (Lưu trữ danh mục, thông tin sản phẩm và lịch sử giá cả).
* **Caching:** Redis (Lưu bộ nhớ đệm để tăng tốc độ phản hồi API và xử lý kiểm tra chống trùng lặp dữ liệu - Idempotency).
* **Message Broker:** RabbitMQ (Đóng vai trò làm hàng đợi thông điệp, giúp Python sau khi cào dữ liệu xong sẽ đẩy vào đây, và Node.js sẽ lấy ra để xử lý từ từ, đảm bảo hệ thống không bị quá tải và không mất mát dữ liệu).

### 3.4. Vận hành & Triển khai (Deployment)
* **Container hóa:** Docker & Docker Compose (Đóng gói toàn bộ ứng dụng và database thành các container độc lập).
* **Hạ tầng:** Triển khai trên 1 máy chủ ảo (VPS).
* **CI/CD:** Sử dụng GitHub Actions để tự động hóa quy trình kiểm thử và cập nhật phiên bản mới lên VPS.