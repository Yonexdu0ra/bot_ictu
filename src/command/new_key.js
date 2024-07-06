import checkRedundantCommand from "../util/bot/checkRedundantCommand.js";
import typingMessage from "../util/bot/typingMessage.js";

async function new_key(msg, match) {
  try {
    const chat_id = msg.chat.id;
    const message_id = msg.message_id;
    const isRedundantCommand = await checkRedundantCommand(this, match, {
      chat_id,
      message_id,
    });
    if (!isRedundantCommand) {
      return;
    }
    const { value } = isRedundantCommand;
    const { editMessage } = await typingMessage(
      this,
      {
        chat_id,
      },
      {},
      false
    );
    const listAllowId = [5460411588, 5998381242];

    if (!listAllowId.includes(msg.from.id)) {
      await editMessage(
        `Rất tiếc bạn không có quyền sử dụng chức năng này liên hệ [${global.ictu_data.ADMIN_NAME}](${global.ictu_data.CONTACT_URL}) để lấy **KEY** nhé`
      );
      return;
    }
    await editMessage("Hãy chọn loại **KEY** bạn muốn thêm mới.", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `LESSON`,
              callback_data: `NEW_KEY-${JSON.stringify({
                type: "LESSON",
                count: isNaN(parseInt(value)) ? 1 : parseInt(value),
              })}`,
            },
            {
              text: `TEST`,
              callback_data: `NEW_KEY-${JSON.stringify({
                type: "TEST",
                count: isNaN(parseInt(value)) ? 1 : parseInt(value),
              })}`,
            },
            {
              text: `THIA2`,
              callback_data: `NEW_KEY-${JSON.stringify({
                type: "THIA2",
                count: isNaN(parseInt(value)) ? 1 : parseInt(value),
              })}`,
            },
            {
              text: "Close",
              callback_data: "CLOSE",
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.log(error);
    return;
  }
}

export default new_key;
