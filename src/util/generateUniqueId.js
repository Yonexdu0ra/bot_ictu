function generateUniqueId(sign = 'KEY') {
  // Lấy số miliseconds tính từ 1/1/1970
  const timestamp = Date.now().toString(36);
  // Tạo một chuỗi ngẫu nhiên
  const randomString = Math.random().toString(36).substring(2, 15);
  // Kết hợp chuỗi miliseconds và chuỗi ngẫu nhiên
  // để tạo ra chuỗi có khả năng duy nhất cao
  return `${sign}_${timestamp}${randomString}`.toLocaleUpperCase();
}

export default generateUniqueId