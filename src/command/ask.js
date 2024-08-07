import checkRedundantCommand from "../util/bot/checkRedundantCommand.js";
import typingMessage from "../util/bot/typingMessage.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function ask(message, match) {
  const chat_id = message.chat.id;
  const message_id = message.message_id;
  try {
    const isRedundantCommand = await checkRedundantCommand(this, match, {
      chat_id, 
      message_id,
    });
    if (!isRedundantCommand) {
      return;
    }
    const { value, command } = isRedundantCommand;
    const { editMessage } = await typingMessage(this, {
      chat_id,
      message: "Câu hỏi hay đấy 🤡",
    });
    if (!value.trim()) {
      await editMessage(
        `Vui lòng điền nội dung theo cú pháp \`${command} Xin chào\`\n\nTrong đó **Xin chào** là câu hỏi bạn muốn hỏi **AI**`
      );
      return;
    }
    const genAI = new GoogleGenerativeAI(global.ictu_data.API_TOKEN_GEMINIAI);
    const generationConfig = {
      maxOutputTokens: 3000,
    };
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      markdown: true,
      generationConfig,
    });
    const result = await model.generateContentStream(value);
    const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));
    let text = "";
    const date = new Date();
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      text += chunkText;
      await delay(500);
      await editMessage(text, {
        parse_mode: undefined,
      });
    }
    await editMessage(`${text}\n${Math.floor((new Date() - date) / 1000)}s`);
  } catch (error) {
    console.log(error);
    await this.sendMessage(chat_id, `Thử lại sau nhé`);
    return;
  }
}

export default ask;
