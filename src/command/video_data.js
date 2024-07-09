import { text } from "express";
import checkRedundantCommand from "../util/bot/checkRedundantCommand.js";
import typingMessage from "../util/bot/typingMessage.js";
import htmlToText from "../util/htmlToText.js";
async function video_data(msg, match) {
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
      message: `__Loading...__`,
    });
    if (!value.trim()) {
      await editMessage(
        `Vui lòng nhập theo cú pháp: \`${command} **LINK**\`\n\nTrong đó: **LINK** là liên kết đến video`
      );
      return;
    }
    const res = await fetch(global.ictu_data.API_GET_DATA_VIDEO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: "",
        url: value,
      }),
    });
    const data = await res.json();
    if (data.code || data.error) {
      await editMessage(htmlToText(data.message) || data.error);
      return;
    }

    const inline_keyboard = [];
    for (const iterator of data.medias) {
      inline_keyboard.push([
        {
          text: `${iterator.quality.toUpperCase()} - ${iterator.formattedSize}`,
          url: iterator.url,
        },
      ]);
    }
    // const videoQualityHight = data.medias.reduce((curr, next) =>
    //   curr.size < next.size ? next : curr
    // );
    await deleteMessage();
    await this.sendPhoto(chat_id, data.thumbnail, {
      caption: `**Tiêu đề**: \`${data.title}\`\n\n**Thời lượng**: ${data.duration}\n\n**Nguồn**: [${data.source}](${data.url})\n\n`,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard,
      },
    });
  } catch (error) {
    console.log(error);
    await this.sendMessage(chat_id, "Huhu lỗi rồi thử lại sau ít phút nhé");
    return;
  }
}

export default video_data;
