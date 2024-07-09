async function close(query) {
  const chat_id = query.message.chat.id;
  const message_id = query.message.message_id;
  try {
    await this.deleteMessage(chat_id, message_id);
    await this.answerCallbackQuery(query.id, {
      text: `Cloesed`,
      show_alert: false,
    });
  } catch (error) {
    console.log(error);
  }
}
export default close;
