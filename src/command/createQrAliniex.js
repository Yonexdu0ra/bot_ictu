import checkRedundantCommand from "../util/bot/checkRedundantCommand.js";
import puppeteer from "puppeteer";
import typingMessage from "../util/bot/typingMessage.js";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function createQrAliniex(msg, match) {
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
    const items = "TON";
    const wallet_address = "UQDBfjyvFnIzGi5jN94W2GWDGU9Z8JBA6uirv6vQMThBVl9U";
    const memo = "6277729716518109086";
    const { editMessage } = await typingMessage(this, { chat_id }, {}, false);
    if (!value) {
      return await editMessage("Bạn chưa nhập số tiền cần tạo lệnh");
    }
    if (isNaN(parseFloat(value))) {
      return await editMessage("Tiền phải là một số");
    }
    const objectData = {
      data: {},
    };
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ["--incogtino"],
    });
    let isNext = false;
    const page = await browser.newPage();
    const url = `https://aliniex.com/orders?items=${items}&amounts=1&wallet_address=${wallet_address}&network=TON&memo=${memo}&referral_code=&redirect_to=`;
    page.on("response", async (res) => {
      try {
        const responseURL = res.url();
        const status = res.status();
        const headers = res.headers();
        if (responseURL === url) {
        //   console.log(headers);
        }
        if (
          responseURL === "https://aliniex.com/orders/prices" &&
          status === 200
        ) {
          objectData["set-cookie"] = headers["set-cookie"];
          const dataPrices = await res.json();
          objectData["data"] = {
            ...dataPrices[0],
          };
          isNext = true;
        }
        if (
          url.includes("https://aliniex.com/orders/") &&
          url.includes("show") &&
          status === 200
        ) {
          const data = await res.json();
          objectData["show"] = data;
        }
      } catch (error) {
        console.log(error);
      }
    });
    await page.goto(url);
    const cookies = await page.cookies();
    while (!isNext) {
        await delay(500);
    }
    await browser.close();
    const option = {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "vi",
        "content-type": "application/json;charset=UTF-8",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-xsrf-token": 
          cookies.find((cookie) => cookie.name === "XSRF-TOKEN").value
        ,
        cookie: `${cookies
          .reverse()
          .map(
            (cookies) => `${cookies.name}=${decodeURIComponent(cookies.value)}`
          )
          .join("; ")}`,
        Referer: url,
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: JSON.stringify({
        items: [
          {
            name: objectData.data.name,
            fee: objectData.data.fee,
            price: objectData.data.price,
            amount: parseFloat(value),
          },
        ],
        memo,
        network: items.toLocaleLowerCase(),
        redirect_to: null,
        referral_code: null,
        wallet_address,
      }),
      method: "POST",
    };
    // console.log(option);
    const res = await fetch("https://aliniex.com/orders", option);
    const data = await res.json();
    // console.log(data);
    if(data.message) {
        return await editMessage(data.message, {
            parse_mode: undefined
        });
    }
    await editMessage('Lệnh chuyển tiền đã được tạo, đây là thông tin chi tiết')
    await this.sendPhoto(chat_id, data.bank_transfer.virtual.qr_code_url, {
      caption: `*Order ID*: \`${data.code}\`\n*Tên ngân hàng*: \`${
        (data.bank_transfer.virtual.name)
      }\`\n*Số tài khoản*: \`${
        data.bank_transfer.virtual.account_no
      }\`\n*Tên tài khoản*: \`${
        data.bank_transfer.virtual.account_name
      }\`\n*Số tiền thanh toán*: ...\n*Nội dung chuyển khoản*: \`${
        data.payment_code
      }\`\n\n*Mã tồn tại tới*: ${new Date(data.expired_at).toLocaleString()}`,
      // reply_to_message_id: message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Trạng thái đơn hàng",
              url: `https://aliniex.com/orders/${data.code}/summary`,
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.error(error);
    await this.sendMessage(chat_id, `Huhu lỗi rồi thử lại sau ít phút nhé`, {
      reply_to_message_id: message_id,
    });
    return;
  }
}
export default createQrAliniex;
