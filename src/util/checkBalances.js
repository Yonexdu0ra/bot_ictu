import BankHistory from "../model/BankHistory.js";
import isTraceNumber from "../util/isTraceNumber.js";

async function checkBalances() {
  try {
    const res = await fetch(global.ictu_data.BANK_URL, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        AuthKey: global.ictu_data.AUTH_KEY_BANK,
        contentType: "application/json",
      },
    });
    const data = await res.json();
    if (data.error) {
      console.log(data.error.message.value);
      await this.sendMessage(
        global.ictu_data.TELEGRAM_CHAT_ID_ADMIN,
        data.error.message.value
      );
      return;
    }
    if (!data?.d?.results || data?.d?.results?.length === 0) {
      return;
    }
    const bankHistory = await BankHistory.find({});
    for (const bankData of data.d.results) {
      const fullContent = bankData.Content;
      const arrayData = bankData.Content.split("|");
      const tranferTime = arrayData[0]?.replace("VPB:", "");
      const accountReceived = arrayData[1];
      const amountReceived = arrayData[2].substring(0, arrayData[2].length - 3);
      const content = arrayData[4].substring(arrayData[4].indexOf("ND") + 3);
      const trace = isTraceNumber(fullContent);
      if (isNaN(trace)) {
        continue;
      }
      const isExist = bankHistory.find((item) => item.trace === trace);
      if (isExist) {
        continue;
      }
      if (fullContent.includes("NHAN TU")) {
        const accountSent = fullContent.substring(
          fullContent.indexOf("NHAN TU") + 8,
          fullContent.indexOf("TRACE") - 1
        );
        await BankHistory.create({
          tranferTime,
          amountReceived: parseFloat(amountReceived),
          content,
          trace,
          accountReceived,
          accountSent,
          fullContent,
        });
        await this.sendMessage(
          global.ictu_data.TELEGRAM_CHAT_ID_ADMIN,
          `*Thông báo số dư biến động !*\n\n*Nhận Từ*: \`${accountSent}\`\n*Số tiền*: \`${amountReceived}\` \n*Lúc*: \`${tranferTime}\`\n*Nội dung chuyển khoản*: \`${content}\`\n*Mã giao dịch*: \`${trace}\`\n*Thông tin đầy đủ*\n\`${fullContent}\``,
          {
            parse_mode: "Markdown",
          }
        );
      } 
    }
  } catch (error) {
    console.log(error);
    await this.sendMessage(
      global.ictu_data.TELEGRAM_CHAT_ID_ADMIN,
      `\`\`\`JSON\n${JSON.stringify(error, null, 2)}\`\`\``,
      {
        parse_mode: "Markdown",
      }
    );
    return;
  }
}

export default checkBalances;
