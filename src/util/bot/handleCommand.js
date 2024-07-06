import timetables from "../../command/timetables.js";
import time_now from "../../command/time_now.js";
import translate from "../../command/dich.js";
import weather from "../../command/weather.js";
import set_user from "../../command/set_user.js";
import set_pass from "../../command/set_pass.js";
import lich_hoc from "../../command/lich_hoc.js";
import lich_thi from "../../command/lich_thi.js";
import ask from "../../command/ask.js";
import help from "../../command/help.js";
import diem_thi from "../../command/diem_thi.js";
import lms_video from "../../command/lms_video.js";
import lms_exercise from "../../command/lms_exercise.js";
import qr from "../../command/qr.js";
import new_key from "../../command/new_key.js";
import set_key from "../../command/set_key.js";
import get_key from "../../command/get_key.js";
import dice from "../../command/dice.js";
import thiA2 from "../../command/thiA2.js";
import video_data from "../../command/video_data.js";
const handleCommand = [
  {
    regex: /\/ask/,
    handler: ask,
  },
  {
    regex: /\/thia2/,
    handler: thiA2,
  },
  {
    regex: /\/video_data/,
    handler: video_data,
  },
  {
    regex: /\/timetables/,
    handler: timetables,
  },
  {
    regex: /\/time_now/,
    handler: time_now,
  },
  {
    regex: /\/qr/,
    handler: qr,
  },
  {
    regex: /\/dich/,
    handler: translate,
  },
  {
    regex: /\/weather/,
    handler: weather,
  },
  {
    regex: /\/set_user/,
    handler: set_user,
  },
  ,
  {
    regex: /\/set_pass/,
    handler: set_pass,
  },
  {
    regex: /\/lich_hoc/,
    handler: lich_hoc,
  },
  {
    regex: /\/lich_thi/,
    handler: lich_thi,
  },
  {
    regex: /\/diem_thi/,
    handler: diem_thi,
  },
  {
    regex: /\/help/,
    handler: help,
  },
  {
    regex: /\/start/,
    handler: help,
  },
  {
    regex: /\/lms_video/,
    handler: lms_video,
  },
  {
    regex: /\/lms_exercise/,
    handler: lms_exercise,
  },
  {
    regex: /\/new_key/,
    handler: new_key,
  },
  {
    regex: /\/set_key/,
    handler: set_key,
  },
  {
    regex: /\/get_key/,
    handler: get_key,
  },
  {
    regex: /\/dice/,
    handler: dice,
  },
];

export default handleCommand;
