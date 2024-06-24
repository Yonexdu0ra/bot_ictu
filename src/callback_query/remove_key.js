import checkSetAccount from "../util/bot/checkSetAccount.js";
import typingMessage from "../util/bot/typingMessage.js";
import checkPermisson from "../util/bot/checkPermisson.js";

async function remove_key({ data, query }) {
  const message = query.message;
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
    const json = JSON.parse(data);
    const { editMessage } = await typingMessage(this, {
      chat_id,
      message: `Đợi chút để mình xóa Key: *${json.key}*`,
    });
    if (!checkPermisson(chat_id)) {
      await editMessage("Bạn không có quyền sử dụng chức năng này");
      return;
    }
    await Key.deleteOne({
      key: json.key,
    });
    await editMessage(`Đã xóa key: *${json.key}*`);
    await this.deleteMessage(chat_id, message_id);
  } catch (error) {
    console.error(error);
    await this.sendMessage(chat_id, `Huhu lỗi rồi thử lại sau ít phút nhé`, {
      reply_to_message_id: message_id,
    });
    return;
  }
}
export default remove_key;
