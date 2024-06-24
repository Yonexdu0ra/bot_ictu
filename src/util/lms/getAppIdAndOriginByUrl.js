
function getDataByUrl(url) {
  if (url.toUpperCase().includes("TUEBA")) {
    return {
      url: global.ictu.URL_LMS_SERVER_TUEBA,
      appId: global.ictu.APP_ID_LMS_TUEBA,
      origin: global.ictu.URL_LMS_TUEBA,
    };
  }
  return {
    url: global.ictu.URL_LMS_SERVER_ICTU,
    appId: global.ictu.APP_ID_LMS_ICTU,
    origin: global.ictu.URL_LMS_ICTU,
  };
}

export default getDataByUrl;
