import checkRedundantCommand from "../util/bot/checkRedundantCommand.js";
import Key from "../model/Key.js";
import dataConfig from "../config/data.js";
import typing_message from "../util/bot/typingMessage.js";

async function get_key(msg, match) {
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
    const { editMessage } = await typing_message(
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
        `Rất tiếc bạn không có quyền sử dụng chức năng này liên hệ [${dataConfig.admin_name}](${dataConfig.contact_url}) để lấy key nhé`
      );
      return;
    }
    if (!value) {
      const listKey = await Key.find({});
      if (!listKey) {
        editMessage(`Chưa có key nào 👀 ! `);
      }
      await editMessage(`**Danh sách KEY**:`);
      for (const keyData of listKey) {
        await this.sendMessage(
          chat_id,
          `*Key*:  \`${keyData.key}\`\n*Loại*: ${keyData.type}\n*Số lượt còn lại*: ${keyData.count}`,
          {
            parse_mode: "Markdown",
            message_id,
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
      }
      return;
    } else {
      const findKey = await Key.findOne({ key: value });
      if (!findKey) {
        await editMessage(`**Key** \`${value}\` không tồn tại`);
        return;
      }
      await this.sendMessage(
        chat_id,
        `**Key**:  \`${findKey.key}\`\n*Loại*: ${findKey.type}\n*Số lượt còn lại*: ${findKey.count}`,
        {
          parse_mode: "Markdown",
          message_id,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `Tăng lượt`,
                  callback_data: `ADD_KEY-${JSON.stringify({
                    key: findKey.key,
                  })}`,
                },
                {
                  text: `Giảm lượt`,
                  callback_data: `REDUCE_KEY-${JSON.stringify({
                    key: findKey.key,
                  })}`,
                },
                {
                  text: `Xóa Key`,
                  callback_data: `REMOVE_KEY-${JSON.stringify({
                    key: findKey.key,
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
    }
  } catch (error) {
    console.log(error);
    return;
  }
}

export default get_key;
