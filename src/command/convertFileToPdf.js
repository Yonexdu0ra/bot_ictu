import checkRedundantCommand from "../util/bot/checkRedundantCommand.js";

async function convertFileToPdf(message, match) {
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
    console.log(message);
  } catch (error) {
    console.log(error);
  }
}

export default convertFileToPdf;
