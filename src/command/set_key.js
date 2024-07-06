import checkRedundantCommand from "../util/bot/checkRedundantCommand.js";
import typing_message from "../util/bot/typingMessage.js";
import Key from "../model/Key.js";
import Account from "../model/Account.js";
async function set_key(msg, match) {
  const chat_id = msg.chat.id;
  const message_id = msg.message_id;
  try {
    const isRedundantCommand = await checkRedundantCommand(this, match, {
      chat_id,
      message_id,
    });
    if (!isRedundantCommand) {
      return;
    }
    const { value, command } = isRedundantCommand;
    const { editMessage } = await typing_message(
      this,
      {
        chat_id,
      },
      {},
      false
    );
    if (value.length < 1) {
      await editMessage(
        `Vui lòng nhập theo cú pháp: \`${command}\`  **KEY**\n\nTrong đó **KEY** là mã bạn được [${global.ictu_data.ADMIN_NAME}](${global.ictu_data.CONTACT_URL}) cung cấp\n\nLưu ý: có nhiều loại **KEY** khác nhau vui lòng nhập đúng loại key mà chức năng của bạn muốn sử dụng`
      );
      return;
    }
    await editMessage(`Đợi chút để mình xác thực **KEY** nhé`);
    const isHasKey = await Key.findOne({
      key: value,
    });
    if (!isHasKey) {
      await editMessage(
        `**KEY** không hợp lệ vui lòng liên hệ [${global.ictu_data.ADMIN_NAME}](${global.ictu_data.CONTACT_URL}) để lấy **KEY**`
      );
      return;
    }
    const isAccount = await Account.findOne({
      chat_id,
    });
    if (!isAccount) {
      await editMessage("Đợi mình một chút nữa nhé");
      await Account.create({
        chat_id,
        key: value,
      });
    } else {
      await Account.findOneAndUpdate(
        { chat_id },
        {
          key: value,
        }
      );
    }
    await this.deleteMessage(chat_id, message_id);
    await editMessage(
      `set **KEY** thành công **KEY** còn **${isHasKey.count}** lần sử dụng !`
    );
  } catch (error) {
    console.log(error);
    await this.sendMessage(chat_id, `Huhu lỗi rồi thử lại sau ít phút nhé`);
    return;
  }
}

export default set_key;
