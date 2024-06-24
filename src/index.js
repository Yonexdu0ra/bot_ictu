// set up timezone UTC+7
process.env.TZ = "Asia/Bangkok";
// set up variable data global
global["ictu_data"] = {
  ...process.env,
};

import botTelegram from "node-telegram-bot-api";
import express from "express";
import connectDB from "./model/index.js";
import listCommandInfo from "./util/bot/listCommandInfo.js";
import handleCommand from "./util/bot/handleCommand.js";
import callback_query from "./callback_query/index.js";
import inline_query from "./inline_query/index.js";
const app = express();

(async () => {
  try {
    await connectDB(
      `mongodb+srv://${process.env.USERNAME_DB}:${encodeURI(
        process.env.PASSWORD_DB
      )}@bot.utkbgol.mongodb.net/?retryWrites=true&w=majority`,
      {}
    );
    const bot = new botTelegram(process.env.ACCESS_TOKEN_TELEGRAM, {
      polling: true,
    });

    bot.setMyCommands(listCommandInfo);
    handleCommand.forEach((obj) => {
      bot.onText(obj.regex, obj.handler.bind(bot));
    });

    bot.on("error", () => {
      console.log("Bot error ");
      return;
    });
    bot.on("polling_error", (error) => {
      console.log(error);
    });
    bot.on("callback_query", callback_query.bind(bot));
    bot.on("inline_query", inline_query.bind(bot));
  } catch (error) {
    console.log(error);
  }
})();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    message: `Ping success ${new Date().toLocaleString()}`,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
