import checkRedundantCommand from "../util/bot/checkRedundantCommand.js";
import checkSetAccount from "../util/bot/checkSetAccount.js";
import typingMessage from "../util/bot/typingMessage.js";
import getLichHoc from "../util/dktc/getLichHoc.js";
async function getLichHocICTU(msg, match) {
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
    const { editMessage } = await typingMessage(this, {
      chat_id,
      message: `Gợi ý: Bạn có thể thêm *detail* ở sau command để xem chi tiết các môn có học ẩn (không có lịch học) nhé\nVí dụ: \`${command} detail\``,
    });
    const isSetAccount = await checkSetAccount(chat_id);
    if (!isSetAccount.status) {
      await editMessage(isSetAccount.message);
      return;
    }
    const isData = getLichHoc(isSetAccount.username, isSetAccount.password);
    let newData = await isData.next();
    await editMessage(await newData.value.message, {
      parse_mode: 'Markdown'
    });
    while (newData.done === false) {
      newData = await isData.next();
      if (
        newData.value.status === "error" ||
        newData.value.status === "success"
      ) {
        break;
      }
      await editMessage(await newData.value.message, {
        parse_mode: 'Markdown'
      });
    }
    if (newData.value.status === "error") {
      await editMessage(await newData.value.message, {
        parse_mode: 'Markdown'
      });
      return;
    }
    let isHasMessage = false;
    for (const iterator of newData.value.data) {
      if (
        iterator.time === "Hiện không có Lịch 🎉✨" &&
        value?.toLowerCase()?.trim() !== "detail"
      ) {
        continue;
      }
      await this.sendMessage(
        chat_id,
        `*Môn*: __${iterator.class_name}__\n\n*Mã lớp*: _${
          iterator.class_code
        }_\n\n*Thời gian*: __${iterator.time}__\n\n*Địa điểm*: __${
          iterator.address
        }__\n\n*Giảng Viên*: __${iterator.lecturers}__\n\n*Sĩ số*: __${
          iterator.number_of_student
        }__\n\n*Số sinh viên đăng ký*: __${
          iterator.number_of_student_register
        }__\n\n*Số tín chỉ*: __${iterator.credits}__\n\n*Học phí*: __${
          iterator.tuition || "Không tìm thấy"
        }__\n\n*Ghi chú*: __${iterator.note || "Không có ghi chú"}__`,
        {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }
      );
      isHasMessage = true;
    }
    if (!isHasMessage) {
      await editMessage("Hiện không có lịch học nào trong tuần này 🎉✨");
    }
  } catch (error) {
    console.error(error);
    await this.sendMessage(chat_id, `Huhu lỗi rồi thử lại sau ít phút nhé`);
    return;
  }
}
export default getLichHocICTU;
