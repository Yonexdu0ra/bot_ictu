function getUrlByUsername(username) {
  let url = global.ictu_data.URL_LMS_SERVER_ICTU,
    appId = global.ictu_data.APP_ID_LMS_ICTU,
    origin = global.ictu_data.URL_LMS_ICTU;
  if (username?.toUpperCase()?.includes("DTE")) {
    url = global.ictu_data.URL_LMS_SERVER_TUEBA;
    appId = global.ictu_data.APP_ID_LMS_TUEBA;
    origin = global.ictu_data.URL_LMS_TUEBA;
  }
  return {
    url,
    appId,
    origin,
    university: username?.toUpperCase()?.includes("DTE") ? "TUEBA" : "ICTU",
  };
}

export default getUrlByUsername;
