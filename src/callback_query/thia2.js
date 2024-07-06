import tracking from "../util/bot/tracking.js";
import typingMessage from "../util/bot/typingMessage.js";
import Account from "../model/Account.js";
import Key from "../model/Key.js";
async function thiA2({ data, query }) {
  const message = query.message;
  const json = JSON.parse(data);
  const chat_id = message.chat.id;
  const message_id = message.message_id;
  try {
    const { editMessage } = await typingMessage(this, {
      chat_id,
      message: "Đợi chút nhé",
    });
    const accountData = await Account.findOne({
      chat_id,
    });
    if (!accountData) {
      await editMessage(
        `Chức năng này cần bạn cung cấp **KEY** để sử dụng !\n\nBạn có thể cung cấp bằng cách gửi tin nhắn với cú pháp: \n\n\/set_key - để thiết lập **KEY**\n\nNếu bạn không có **KEY** vui lòng liên hệ [${global.ictu_data.ADMIN_NAME}](${global.ictu_data.CONTACT_URL}).`
      );

      return;
    }
    const isKey = await Key.findOne({ key: accountData.key });
    if (!isKey || isKey.count < 1) {
      await editMessage(
        `Rất tiếc **KEY** của bạn hết lượt sử dụng rồi liên hệ [${global.ictu_data.ADMIN_NAME}](${global.ictu_data.CONTACT_URL}) để tăng thêm lượt nhé !`
      );
      return;
    }
    if (isKey.type !== "THIA2") {
      await editMessage(`**KEY** của bạn không thể dùng được chức năng này`);
      return;
    }

    if (!global.access_token_thia2 || !global.temp_email) {
      await editMessage("Lệnh này đã hết hạn vui lòng chạy lại từ đầu nhé.");
      return;
    }
    await Key.findOneAndUpdate(
      {
        key: accountData.key,
      },
      {
        count: isKey.count - 1,
      }
    );

    await tracking(this, message, [global.ictu_data.TELEGRAM_CHAT_ID_ADMIN]);

    await editMessage(`Đang tiến lấy dữ liệu...`);
    const res = await fetch(
      `${process.env.URL_SERVER_GLITCH}/api/v1/thia2/?secret_key=${
        process.env.SECRET_KEY
      }&email=${global.temp_email}&shift_test_id=${json.value}&token=${
        global.access_token_thia2 || ""
      }`
    );
    const data = await res.json();
    if (data.status === "error") {
      await Key.findOneAndUpdate(
        {
          key: accountData.key,
        },
        {
          count: isKey.count,
        }
      );
      await editMessage(`Lấy dữ liệu không thành công`);
      return;
    }

    await editMessage(`Đang tạo liên kết...`);
    const res2 = await fetch(`${process.env.URL_SERVER_GLITCH_2}/api/v1/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
      }),
    });
    const data2 = await res2.json();
    if (data2.status === "error") {
      await editMessage(data2.message);
      return;
    }
    const encodeURL = btoa(data2.data);
    await editMessage(
      `⚠️ Hiệu lực của liên kết này chỉ có thể *dùng 1 lần duy nhất* và liên kết có hiệu lực *khoảng 5 phút* hãy nhanh chóng truy cập và lưu lại thông tin nhé\n\n💡 *Mẹo*: Ở *Window* có thể dùng tổ hợp phím \`Ctrl + s\`,  *Android* ấn \`...\` chọn nút \`download\` để có thể tải lại file để xem sau\n\nNếu gặp sự cố vui lòng liên hệ [Admin](${global.ictu_data.CONTACT_URL})`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Truy cập bài kiểm tra",
                url: `${process.env.URL_SERVER_RENDER}/?u=${encodeURL}`,
              },
            ],
          ],
        },
      }
    );
  } catch (error) {
    console.error(error);
    await this.sendMessage(chat_id, `Huhu lỗi rồi thử lại sau ít phút nhé`, {
      reply_to_message_id: message_id,
    });
    return;
  }
}
export default thiA2;
