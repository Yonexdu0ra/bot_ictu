import lms_video from "./lms_video.js";
import lms_exercise from "./lms_exercise.js";
import new_key from "./new_key.js";
import close from "./close.js";
import remove_key from "./remove_key.js";
import addKey from "./addCountKey.js";
import reduceKey from "./reduceCountKey.js";
import responseMessage from "./responseMessage.js";
import diem_thi from "./diem_thi.js";
import dice from "./dice.js";
import thia2 from "./thia2.js";
async function callback_query(query) {
  try {
    const payload = query.data.split("-");
    const type = payload.shift();
    switch (type) {
      case "SKIP": {
        await lms_video.call(this, {
          data: payload.join("-"),
          query,
        });
        break;
      }
      case "GET_DIEM_THI": {
        await diem_thi.call(this, {
          data: payload.join("-"),
          query,
        });
        break;
      }
      case "NEW_KEY": {
        await new_key.call(this, {
          data: payload.join("-"),
          query,
        });
        break;
      }
      case "ADD_KEY": {
        await addKey.call(this, {
          data: payload.join("-"),
          query,
        });
        break;
      }
      case "REDUCE_KEY": {
        await reduceKey.call(this, {
          data: payload.join("-"),
          query,
        });
        break;
      }
      case "REMOVE_KEY": {
        await remove_key.call(this, {
          data: payload.join("-"),
          query,
        });
        break;
      }
      case "LESSON": {
        await lms_exercise.call(this, {
          data: payload.join("-"),
          query,
        });
        break;
      }
      case "RESPONSE": {
        await responseMessage.call(this, {
          data: payload.join("-"),
          query,
        });
        break;
      }
      case "DICE": {
        await dice.call(this, {
          data: payload.join("-"),
          query,
        });
        break;
      }
      case "THIA2": {
        await thia2.call(this, {
          data: payload.join("-"),
          query,
        });
        break;
      }
      case "CLOSE": {
        await close.call(this, query);
        break;
      }
      default: {
        return;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export default callback_query;
