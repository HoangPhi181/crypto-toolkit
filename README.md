# Crypto Toolkit - Bộ công cụ mã hóa trực quan

Dự án này là một ứng dụng web được xây dựng trên nền tảng React và Vite, cung cấp các công cụ mã hóa và băm dữ liệu phổ biến phục vụ cho mục đích học tập và nghiên cứu về An toàn bảo mật thông tin.

## Chức năng chính

### 1. Mã hóa đối xứng (Symmetric Encryption)
Hỗ trợ các thuật toán mã hóa phổ biến với các tùy chọn về chế độ hoạt động (Mode) và khóa (Key):
- AES (Advanced Encryption Standard): Hỗ trợ các độ dài khóa 128-bit, 192-bit và 256-bit với chế độ CBC và ECB.
- DES (Data Encryption Standard): Thuật toán mã hóa 64-bit truyền thống.
- Triple DES (3DES): Phiên bản nâng cấp của DES bằng cách áp dụng thuật toán 3 lần với các khóa khác nhau.

### 2. Mã hóa bất đối xứng (Asymmetric Encryption)
- RSA: Hỗ trợ sinh cặp khóa Public/Private (1024-bit hoặc 2048-bit), thực hiện mã hóa bằng khóa công khai và giải mã bằng khóa bí mật theo chuẩn PEM.

### 3. Hàm băm (Hash Functions)
- MD5: Tạo chuỗi băm 128-bit nhanh chóng.
- SHA-256: Hàm băm an toàn theo tiêu chuẩn SHA-2.
- So sánh Hash: Công cụ kiểm tra tính toàn vẹn của dữ liệu bằng cách so sánh mã hash của hai văn bản khác nhau, minh họa hiệu ứng thác đổ (Avalanche Effect).

## Công nghệ sử dụng

- Framework: React (Vite)
- Thư viện mã hóa: Crypto-JS, JSEncrypt
- Biểu tượng: Lucide React
- Quản lý trạng thái: React Hooks

## Hướng dẫn cài đặt và khởi chạy

Để cài đặt và chạy dự án này trên máy cục bộ, bạn cần thực hiện các bước sau:

1. Clone dự án từ repository:
   ```bash
   git clone https://github.com/HoangPhi181/crypto-toolkit.git
   ```

2. Di chuyển vào thư mục dự án:
   ```bash
   cd crypto-toolkit
   ```

3. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```

4. Khởi chạy môi trường phát triển:
   ```bash
   npm run dev
   ```

5. Truy cập ứng dụng tại địa chỉ: `http://localhost:5173`

## Cấu trúc thư mục

- `src/utils/`: Chứa logic cốt lõi của các thuật toán mã hóa (AES, DES, RSA, Hash).
- `src/pages/`: Giao diện của từng loại thuật toán.
- `src/components/`: Các thành phần giao diện dùng chung (Toast, Navbar, v.v.).
- `src/styles/`: Các file định nghĩa CSS và hệ thống màu sắc.

## Lưu ý bảo mật
Bộ công cụ này được thiết kế cho mục đích giáo dục. Khi sử dụng trong thực tế, hãy đảm bảo bạn tuân thủ các tiêu chuẩn bảo mật hiện hành và không bao giờ chia sẻ khóa bí mật (Secret Key) hoặc khóa tư nhân (Private Key) ra ngoài.
