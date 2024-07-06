function htmlToText(html) {
  return (
    html
      ?.replace(/<[^>]*>/g, "")
      .replace(/\t/g, "")
      ?.trim()
      .replace(/\n/g, "") || ""
  );
}

export default htmlToText;
