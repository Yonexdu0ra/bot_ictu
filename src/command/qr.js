import checkRedundantCommand from "../util/bot/checkRedundantCommand.js";
import typingMessage from "../util/bot/typingMessage.js";
async function qr(msg, match) {
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
    const { editMessage, deleteMessage } = await typingMessage(this, {
      chat_id,
      message: "Đang tạo mã **QR code** ...",
    });
    if (!value.trim() || value.length < 1) {
      await editMessage(
        `Vui lòng nhập theo cú pháp: \`${command}\` **xxx**\n\nTrong đó **xxx** là nội dung bạn muốn chuyển thành mã **QR code**`
      );
      return;
    }
    await this.deleteMessage(chat_id, message_id);
    await deleteMessage();
    await this.sendPhoto(
      chat_id,
      `https://api.qrserver.com/v1/create-qr-code/?data=${value.trim()}&size=500x500`,
      {
        caption: `||${value.trim()}||`,
        parse_mode: "MarkdownV2",
        has_spoiler: true,
      }
    );
  } catch (error) {
    console.log(error);
    await this.sendMessage(chat_id, `Huhu lỗi rồi thử lại sau ít phút nhé`);
    return;
  }
}

export default qr;
