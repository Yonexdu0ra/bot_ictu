// use puppeteer verion ^1.14.0 in glitch
const config = (
  options = {
    headless: "new",
    args: [
      "--no-sandbox", // Cần thiết khi chạy trong môi trường không có quyền root
      "--disable-setuid-sandbox", // Cần thiết khi chạy trong môi trường không có quyền root
      "--disable-dev-shm-usage", // Giảm thiểu lỗi liên quan đến shared memory
      "--disable-accelerated-2d-canvas", // Vô hiệu hóa tăng tốc phần cứng cho canvas 2D
      "--disable-gpu", // Vô hiệu hóa GPU (chỉ cần thiết trên Linux)
      "--window-size=1920x1080", // Đặt kích thước cửa sổ cố định để tránh các vấn đề hiển thị
      "--disable-software-rasterizer", // Tăng tốc độ render
      "--disable-web-security", // Tùy chọn này có thể cần thiết nếu bạn gặp vấn đề với CORS
      "--mute-audio", // Tắt âm thanh để tránh các vấn đề liên quan đến âm thanh
      "--disable-background-networking", // Giảm thiểu các yêu cầu mạng nền
      "--disable-background-timer-throttling", // Vô hiệu hóa hạn chế timer nền
      "--disable-breakpad", // Vô hiệu hóa báo cáo sự cố
      "--disable-client-side-phishing-detection", // Vô hiệu hóa phát hiện phishing phía client
      "--disable-component-update", // Vô hiệu hóa cập nhật thành phần
      "--disable-default-apps", // Vô hiệu hóa các ứng dụng mặc định
      "--disable-domain-reliability", // Vô hiệu hóa độ tin cậy miền
      "--disable-extensions", // Vô hiệu hóa các extension
      "--disable-hang-monitor", // Vô hiệu hóa giám sát treo
      "--disable-ipc-flooding-protection", // Vô hiệu hóa bảo vệ flood IPC
      "--disable-renderer-backgrounding", // Vô hiệu hóa render nền
      "--disable-sync", // Vô hiệu hóa đồng bộ hóa
      "--metrics-recording-only", // Chỉ ghi lại các số liệu
      "--no-first-run", // Bỏ qua thiết lập lần đầu
      "--safebrowsing-disable-auto-update", // Vô hiệu hóa cập nhật tự động cho Safe Browsing
      "--enable-automation",
    ],
    ignoreHTTPSErrors: true, // Bỏ qua các lỗi chứng chỉ HTTPS
    devtools: false,
  }
) => ({
  ...options,
});

export default config;
