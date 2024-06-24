import checkRedundantCommand from "../util/bot/checkRedundantCommand.js";
import checkSetAccount from "../util/bot/checkSetAccount.js";
import typingMessage from "../util/bot/typingMessage.js";
import loginLMS from "../util/lms/loginLMS.js";
import getDataByQueryLMS from "../util/lms/getDataByQueryLMS.js";
import getUrlByUsername from "../util/lms/getUrlByUsername.js";
import Account from "../model/Account.js";
import Key from "../model/Key.js";
async function lms_exercise(msg, match) {
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
      await editMessage(
        `Vui lòng điền username và password để sử  dụng chức năng này.`
      );
      return;
    }
    if (!accountData.key) {
      await editMessage(
        `Để sử dụng chức năng này bạn cần liên hệ [${global.ictu_data.ADMIN_NAME}](${global.ictu_data.CONTACT_URL}) để lấy key nhé`
      );
      return;
    }

    const isKey = await Key.findOne({ key: accountData.key });
    if (!isKey || isKey.count < 1) {
      await editMessage(
        `Rất tiếc key của bạn hết lượt sử dụng rùi liên hệ [${global.ictu_data.ADMIN_NAME}](${global.ictu_data.CONTACT_URL}) để tăng thêm lượt nhé !`
      );
      return;
    }
    if (isKey.type !== "TEST") {
      await editMessage(`Rất tiếc key của bạn chỉ có thể dùng cho Tua video!`);
      return;
    }

    const data = await loginLMS({
      username: accountData.username,
      password: accountData.password,
    });
    if (data.code != "success") {
      await editMessage(`\`\`\`JSON\n${JSON.stringify(data, null, 2)}\`\`\``);
      return;
    }
    await editMessage("Đăng nhập thành công");
    const { url, university } = await getUrlByUsername(accountData.username);
    const token = data.access_token;
    const profile = await getDataByQueryLMS(
      `${url}/${global.ictu_data.PROFILE_LMS}`,
      {
        token,
      }
    );

    const userProfile = await getDataByQueryLMS(
      `${url}/${global.ictu_data.USER_PROFILE_LMS}`,
      {
        query: {
          "condition[0][key]": "user_id",
          "condition[0][value]": profile.data.id,
          "condition[0][compare]": "=",
        },
        token,
      }
    );
    await editMessage(`Hello ${userProfile.data[0].full_name}`);
    const listYear = await getDataByQueryLMS(
      `${url}/${global.ictu_data.CLASS_STUDENT_LMS}`,
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
    const listClassIdCourse = await getDataByQueryLMS(
      `${url}/${global.ictu_data.CLASS_STUDENT_LMS}`,
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
    if (listClassIdCourse.data) {
      const inline_keyboard = [];
      await editMessage(
        `*${userProfile.data[0].full_name}* ơi đây là những môn học kì này cùa bạn hãy chọn môn bạn muốn lấy đáp án ở dưới đây: `
      );
      for (const course of listClassIdCourse.data) {
        const classData = await getDataByQueryLMS(
          `${url}/${global.ictu_data.CLASS_LMS}/${course.class_id}`,
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
            callback_data: `LESSON-${JSON.stringify({
              class_id: classData.data.id,
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
      global[`access_token_${accountData.username}`] = token;
      await editMessage(`Chọn môn học bạn muốn lấy đáp án (${university}): `, {
        reply_markup: {
          inline_keyboard,
        },
      });
    }
  } catch (error) {
    console.error(error);
    await this.sendMessage(chat_id, `Huhu lỗi rồi thử lại sau ít phút nhé`, {
      reply_to_message_id: message_id,
    });
    return;
  }
}
export default lms_exercise;
