import checkSetAccount from "../util/bot/checkSetAccount.js";
import typingMessage from "../util/bot/typingMessage.js";
import checkPermisson from "../util/bot/checkPermisson.js";
import Key from "../model/Key.js";
async function addCountKey({ data, query }) {
  const message = query.message;
  const json = JSON.parse(data);
  const chat_id = message.chat.id;
  const message_id = message.message_id;
  try {
    await this.answerCallbackQuery(query.id, {
      text: `Đang tăng lượt key...`,
      show_alert: false,
    });
    const isSetAccount = await checkSetAccount(chat_id);
    if (!isSetAccount.status) {
      await this.sendMessage(chat_id, isSetAccount.message, {
        reply_to_message_id: message_id,
      });
      return;
    }
    // const { deleteMessage, editMessage } = await typingMessage(this, {
    //   chat_id,
    //   message: `Đợi chút nhé vui lòng đừng spam nhé [${
    //     message.from.first_name
    //   } ${message.from?.last_name || ""}](tg://user?id=${message.from.id}) !`,
    // });
    if (!checkPermisson(chat_id)) {
      await this.editMessageText("Bạn không có quyền sử dụng chức năng này", {
        chat_id,
        message_id,
      });
      return;
    }
    const isKeyData = await Key.findOne({ key: json.key });
    const newKeyData = await Key.findOneAndUpdate(
      { key: json.key },
      {
        count: isKeyData.count + 1,
      },
      { new: true }
    );
    // await deleteMessage();
    await this.editMessageText(
      `*Key*:  \`${newKeyData.key}\`\n*Loại*: ${newKeyData.type}\n*Số lượt còn lại*: ${newKeyData.count}`,
      {
        chat_id,
        message_id,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `Tăng lượt`,
                callback_data: `ADD_KEY-${JSON.stringify({
                  key: newKeyData.key,
                })}`,
              },
              {
                text: `Giảm lượt`,
                callback_data: `REDUCE_KEY-${JSON.stringify({
                  key: newKeyData.key,
                })}`,
              },
              {
                text: `Xóa Key`,
                callback_data: `REMOVE_KEY-${JSON.stringify({
                  key: newKeyData.key,
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
    // await editMessage(
    //   `*Key*:  \`${newKeyData.key}\`\n*Loại*: ${newKeyData.type}\n*Số lượt còn lại*: ${newKeyData.count}`,
    //   {
    //     chat_id,
    //     message_id,
    //     parse_mode: "Markdown",
    //     reply_markup: {
    //       inline_keyboard: [
    //         [
    //           {
    //             text: `Tăng lượt`,
    //             callback_data: `ADD_KEY-${JSON.stringify({
    //               key: newKeyData.key,
    //             })}`,
    //           },
    //           {
    //             text: `Giảm lượt`,
    //             callback_data: `REDUCE_KEY-${JSON.stringify({
    //               key: newKeyData.key,
    //             })}`,
    //           },
    //           {
    //             text: `Xóa Key`,
    //             callback_data: `REMOVE_KEY-${JSON.stringify({
    //               key: newKeyData.key,
    //             })}`,
    //           },
    //           {
    //             text: "Close",
    //             callback_data: "CLOSE",
    //           },
    //         ],
    //       ],
    //     },
    //   }
    // );
  } catch (error) {
    console.error(error);
    await this.sendMessage(chat_id, `Huhu lỗi rồi thử lại sau ít phút nhé`, {
      reply_to_message_id: message_id,
    });
    return;
  }
}
export default addCountKey;
