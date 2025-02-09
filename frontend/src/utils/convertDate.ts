const convertToLocaleString = (
  date: string | null | undefined,
  format?: string
) => {
  if (!date) return null;

  const dateObj = new Date(date);
  const language = localStorage.getItem("language");
  const lang = language || navigator.language || "en-US";

  if (format) {
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear().toString();
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const seconds = dateObj.getSeconds().toString().padStart(2, "0");

    const formattedDate = format
      .replace("DD", day)
      .replace("MM", month)
      .replace("YYYY", year)
      .replace("HH", hours)
      .replace("mm", minutes)
      .replace("ss", seconds);

    return formattedDate;
  }

  return dateObj.toLocaleDateString(lang, { dateStyle: "long" });
};

export default convertToLocaleString;
