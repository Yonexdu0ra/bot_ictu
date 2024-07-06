import checkRedundantCommand from "../util/bot/checkRedundantCommand.js";
import checkSetAccount from "../util/bot/checkSetAccount.js";
import typingMessage from "../util/bot/typingMessage.js";
import loginLMS from "../util/lms/loginLMS.js";
import getDataByQueryLMS from "../util/lms/getDataByQueryLMS.js";
import getUrlByUsername from "../util/lms/getUrlByUsername.js";
import Account from "../model/Account.js";
import Key from "../model/Key.js";


async function lms_video(msg, match) {
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
    const isSetAccount = await checkSetAccount(chat_id);
    if (!isSetAccount.status) {
      await this.sendMessage(chat_id, isSetAccount.message, {
        reply_to_message_id: message_id,
      });
      return;
    }

    const { editMessage } = await typingMessage(this, {
      chat_id,
    });
    const accountData = await Account.findOne({
      chat_id,
    });

    if (!accountData) {
      await editMessage(`Chức năng này cần bạn cung cấp **username** và **password** của **LMS** để sử dụng !\n\nBạn có thể cung cấp bằng cách gửi tin nhắn với cú pháp: \n\n\/set_user - để thiết lập **username**\n\n/set_pass - để thiết lập **password**`)
      return;
    }
    if (!accountData.key) {
      await editMessage(
        `Chức năng này cần bạn cung cấp **KEY** để sử dụng !\n\nBạn có thể cung cấp bằng cách gửi tin nhắn với cú pháp: \n\n\/set_key - để thiết lập **key**\n\nNếu bạn không có **KEY** vui lòng liên hệ [${global.ictu_data.ADMIN_NAME}](${global.ictu_data.CONTACT_URL}).`
      );
      return;
    }

    const isKey = await Key.findOne({ key: accountData.key });
    if (!isKey || isKey.count < 1) {
      await editMessage(
        `Rất tiếc **KEY** của bạn hết lượt sử dụng rồi liên hệ [${global.ictu_data.ADMIN_NAME}](${global.ictu_data.CONTACT_URL}) để tăng thêm lượt nhé !`
      );
      return;
    }

    if (isKey.type !== "LESSON") {
      await editMessage(
        `Rất tiếc **KEY** của bạn không thể sử dụng chức năng này !`
      );
      return;
    }
    let text = '**Thông tin tiến trình**\n\n'
    const data = await loginLMS({
      username: accountData.username,
      password: accountData.password,
    });
    if (data.code != "success") {
      text += `**Đăng nhập**: _Thất bại_\n\n**Ghi chú**: _${data.message}_`
      await editMessage(`\`\`\`JSON\n${JSON.stringify(data, null, 2)}\`\`\``);
      return;
    }
    const { url, university } = getUrlByUsername(accountData.username);
    text += `**Trường**: _${university}_\n\n`
    const token = data.access_token;
    const profile = await getDataByQueryLMS(
      `${url}/${process.env.PROFILE_LMS}`,
      {
        token,
      }
    );
    text += `**Họ tên**: _${profile.data.display_name}_\n\n`
    await editMessage(text);
    const userProfile = await getDataByQueryLMS(
      `${url}/${process.env.USER_PROFILE_LMS}`,
      {
        query: {
          "condition[0][key]": "user_id",
          "condition[0][value]": profile.data.id,
          "condition[0][compare]": "=",
        },
        token,
      }
    );
    const listYear = await getDataByQueryLMS(
      `${url}/${process.env.CLASS_STUDENT_LMS}`,
      {
        query: {
          limit: 1000,
          paged: 1,
          select: "namhoc,hocky",
          "condition[0][key]": "student_id",
          "condition[0][value]": userProfile.data[0].id,
          "condition[0][compare]": "=",
        },
        token,
      }
    );
    text += `**Năm học**: _${listYear.data.at(-1).namhoc.replace('_', '-')}_\n\n**Học kỳ**: _${listYear.data.at(-1).hocky}_\n\n`
    const listClassIdCourse = await getDataByQueryLMS(
      `${url}/${process.env.CLASS_STUDENT_LMS}`,
      {
        query: {
          limit: 1000,
          paged: 1,
          select: "id,class_id,status",
          "condition[0][key]": "student_id",
          "condition[0][value]": userProfile.data[0].id,
          "condition[0][compare]": "=",
          "condition[1][key]": "namhoc",
          "condition[1][value]": listYear.data.at(-1).namhoc,
          "condition[1][compare]": "=",
          "condition[1][type]": "and",
          "condition[2][key]": "hocky",
          "condition[2][value]": listYear.data.at(-1).hocky,
          "condition[2][compare]": "=",
          "condition[2][type]": "and",
        },
        token,
      }
    );
    // await editMessage("Hãy lựa chọn môn học bạn muốn hoàn thành video cấp tốc");
    if (listClassIdCourse.data) {
      const inline_keyboard = [];
      for (const course of listClassIdCourse.data) {
        const classData = await getDataByQueryLMS(
          `${url}/${process.env.CLASS_LMS}/${course.class_id}`,
          {
            token,
            query: {
              select: "id,name,course_id,manager_info,sotinchi,kyhieu",
            },
          }
        );
        inline_keyboard.push([
          {
            text: `${classData.data.name.slice(
              0,
              classData.data.name.indexOf("(") || classData.data.name.length
            )}`,
            callback_data: `SKIP-${JSON.stringify({
              class_id: course.class_id,
              course_id: classData.data.course_id,
              class_stId: course.id,
            })}`,
          },
        ]);
      }
      inline_keyboard.push([
        {
          text: `CLOSE`,
          callback_data: `CLOSE`,
        },
      ]);
      text += `**Danh sách môn học có thể hoàn thành video cấp tốc**\n\n`
      await editMessage(
        text,
        {
          reply_markup: {
            inline_keyboard,
          },
        }
      );
    } else {
      await editMessage("Không có môn học nào cần hoàn thành video cấp tốc");
    }
  } catch (error) {
    console.error(error);
    await this.sendMessage(chat_id, `Huhu lỗi rồi thử lại sau ít phút nhé`, {
      reply_to_message_id: message_id,
    });
    return;
  }
}
export default lms_video;
