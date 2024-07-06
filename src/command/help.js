import checkRedundantCommand from "../util/bot/checkRedundantCommand.js";
import listCommand from "../util/bot/listCommandInfo.js";
import tyingMessage from "../util/bot/typingMessage.js";
async function help(msg, match) {
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
    let text = "*Danh sách các lệnh tương tác với Bot*:\n";
    const { editMessage } = await tyingMessage(
      this,
      {
        chat_id,
        message: text,
      },
      {},
      false
    );
    
    for await (const { command, description } of listCommand) {
      text += `${command}:  _${description}_\n`;
    }

    await editMessage(text);
  } catch (error) {
    console.log(error);
    return;
  }
}

export default help;
