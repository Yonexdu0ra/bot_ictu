// use puppeteer verion ^1.14.0 in glitch
const config = (
  options = {
    headless: true,
    args: [
      "--disable-gpu", // Vô hiệu hóa sự hỗ trợ GPU cho trình duyệt
      // "--disable-dev-shm-usage", // Giảm lượng RAM được sử dụng bởi trình duyệt
      // "--no-first-run", // Bỏ qua cửa sổ setup lần đầu chạy
      "--no-sandbox", // Vô hiệu hóa chế độ sandbox cho các hệ thống không hỗ trợ sandbox
      "--no-zygote", // Tắt zygote process cho Linux sandbox
      // // "--single-process", // Chạy trình duyệt mà không cần multiple processes (không khuyến nghị trên máy cá nhân)
      // "--disable-background-timer-throttling", // Vô hiệu hóa giảm tốc các timer nền
      // "--disable-backgrounding-occluded-windows", // Vô hiệu hóa việc trình duyệt ẩn các cửa sổ không hiển thị
      // "--disable-renderer-backgrounding", // Vô hiệu hóa việc giảm hiệu suất của các trang web dang tải nền],
    ],
  }
) => ({
  ...options,
});


export default config;