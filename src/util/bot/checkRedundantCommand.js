const checkRedundantCommand = async function (
  bot,
  match,
  { chat_id, message_id }
) {
  try {
    const isCommand = match[0];
    const indexCommand = match.index;
    const redundantCommand = match.input
      .replace(`@${global.ictu_data.USERNAME_BOT}`, "")
      .split(" ")[0]
      ?.split(isCommand)[1];
    if (redundantCommand && indexCommand === 0) {
      await bot.sendMessage(chat_id, `Có phải ý bạn là **${isCommand}** ?`, {
        parse_mode: "Markdown",
        reply_to_message_id: message_id,
      });
      return false;
    }
    if (indexCommand !== 0) {
      return false;
    }
    return {
      status: true,
      value: match.input
        .replace(`@${global.ictu_data.USERNAME_BOT}`, "")
        .split(isCommand)[1]
        ?.trim(),
      command: isCommand,
    };
  } catch (error) {
    console.log(error);
    return;
  }
};

export default checkRedundantCommand;
