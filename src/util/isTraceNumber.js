function isTraceNumber(text) {
  const regex = /TRACE\s(\d+)/;
  const match = text.match(regex);
  return match ? parseInt(match[1]) : NaN;
}


export default isTraceNumber