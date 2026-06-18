export function formatDate(date: Date) {
  let month = "" + (date.getMonth() + 1),
    day = "" + date.getDate(),
    year = date.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export function formatTime(date: Date) {
  let second = "" + date.getSeconds(),
    minute = "" + date.getMinutes(),
    hour = "" + date.getHours();

  if (hour.length < 2) {
    hour = "0" + hour;
  }

  if (minute.length < 2) {
    minute = "0" + minute;
  }

  if (second.length < 2) {
    second = "0" + second;
  }

  return [hour, minute, second].join(":");
}
