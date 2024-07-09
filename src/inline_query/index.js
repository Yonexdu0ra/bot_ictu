import Student from "../model/Student.js";
async function inline_query(query) {
  try {
    const queryId = query.id;
    const queryText = query.query;
    if (queryText.trim() == "") {
      return;
    }
    const data = await Student.find({
      full_name: { $regex: queryText, $options: "i" },
    }).limit(30);
    const results = data.map((item) => {
      return {
        type: "article",
        id: item._id,
        title: `${item.full_name} - ${item.class}`,
        input_message_content: {
          message_text: `Thông tin sinh viên:\n *Họ và tên*: \`${item.full_name}\`\n *Mã sinh viên*: \`${item.student_code}\`\n *Ngày sinh*: \`${item.birthday}\`\n *Lớp*: \`${item.class}\`\n *Khoa*: \`${item.department}\`\n *Giới tính*: \`${item.gender}\``,
          parse_mode: "Markdown",
        },
      };
    });
    await this.answerInlineQuery(queryId, results);
  } catch (error) {
    console.log(error);
  }
}

export default inline_query;
