const loginDKTC = async (page, { username, password }) => {
  try {
    await page.goto(global.ictu_data.URL_LOGIN_DKTC);
    await page.waitForNavigation();
    await page.type("input#txtUserName", username);
    await page.type("input#txtPassword", password);
    await page.click("input#btnSubmit");
    await page.waitForSelector("table");
    const cookies = await page.cookies();
    if (cookies[0] && cookies[0].name === "SignIn") {
      return {
        status: true,
        message: "Đăng nhập thành công",
      };
    }
    return {
      status: false,
      message: "Tài khoản hoặc mật khẩu không chính xác !",
      data: cookies,
    };
  } catch (error) {
    return {
      status: false,
      message: "Đã có lỗi xảy ra !",
    };
  }
};

export default loginDKTC;
