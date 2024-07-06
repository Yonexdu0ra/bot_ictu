import checkRedundantCommand from "../util/bot/checkRedundantCommand.js";
import typing_message from "../util/bot/typingMessage.js";
import Account from "../model/Account.js";
async function set_pass(msg, match) {
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
    const { value, command } = isRedundantCommand;
    const { editMessage } = await typing_message(
      this,
      {
        chat_id,
        message: `Đang cập nhật *Password*...`,
      },
      {},
      false
    );
    if (!value.trim()) {
      await editMessage(`Vui lòng điền theo cú pháp: \`${command} Password\`\n\nTrong đó **Password** là mật khẩu **LMS** hoặc **DKTC** của bạn`);
      return;
    }
    let acccount = await Account.findOne({ chat_id });
    if (!acccount) {
      acccount = await Account({ chat_id });
      acccount = await acccount.save();
    }
    const isHasAccount = chat_id in acccount;
    if (!isHasAccount) {
      await Account.updateOne(
        { chat_id },
        {
          password: value.trim(),
        }
      );
      await this.deleteMessage(chat_id, message_id);
      await editMessage(`set *Password* thành công`);
      return;
    }
    await editMessage(`set ~Password thất bại~`);
  } catch (error) {
    console.log(error);
    return;
  }
}

export default set_pass;
