import checkSetAccount from "../util/bot/checkSetAccount.js";
import typingMessage from "../util/bot/typingMessage.js";
import checkPermisson from "../util/bot/checkPermisson.js";
import Key from "../model/Key.js";
import generateUniqueId from "../util/generateUniqueId.js";
async function newKey({ data, query }) {
  const message = query.message;
  const json = JSON.parse(data);
  const chat_id = message.chat.id;
  const message_id = message.message_id;
  try {
    const isSetAccount = await checkSetAccount(chat_id);
    if (!isSetAccount.status) {
      await this.sendMessage(chat_id, isSetAccount.message, {
        reply_to_message_id: message_id,
      });
      return;
    }
    const { editMessage } = await typingMessage(this, {
      chat_id,
      message: "Đang tạo mới **KEY**",
    });
    if (!checkPermisson(chat_id)) {
      await editMessage("Bạn không có quyền sử dụng chức năng này");
      return;
    }
    
    const newKey = generateUniqueId(`${global.ictu_data.SIGN}_${json.type}`);

    const keyData = await Key.create({
      key: newKey,
      count: json.count,
      type: json.type,
    });

    await editMessage(
      `**Key**:  \`${keyData.key}\`\n\n**Loại**: ${keyData.type}\n\n**Số lượt còn lại**: ${keyData.count}`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `Tăng lượt`,
                callback_data: `ADD_KEY-${JSON.stringify({
                  key: keyData.key,
                })}`,
              },
              {
                text: `Giảm lượt`,
                callback_data: `REDUCE_KEY-${JSON.stringify({
                  key: keyData.key,
                })}`,
              },
              {
                text: `Xóa Key`,
                callback_data: `REMOVE_KEY-${JSON.stringify({
                  key: keyData.key,
                })}`,
              },
              {
                text: "Close",
                callback_data: "CLOSE",
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
export default newKey;
