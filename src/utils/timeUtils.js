export function toHumanTime(timestamp) {
  const dt = new Date(timestamp);
  const seconds =
    dt.getSeconds() > 9 ? `${dt.getSeconds()}` : `0${dt.getSeconds()}`;
  const minutes =
    dt.getMinutes() > 9 ? `${dt.getMinutes()}` : `0${dt.getMinutes()}`;
  const hours = dt.getHours() > 9 ? `${dt.getHours()}` : `0${dt.getHours()}`;
  const date = dt.getDate() > 9 ? `${dt.getDate()}` : `0${dt.getDate()}`;
  const month =
    dt.getMonth() > 9 ? `${dt.getMonth() + 1}` : `0${dt.getMonth() + 1}`;
  const year =
    dt.getYear() > 9 ? `${dt.getFullYear()}` : `0${dt.getFullYear()}`;

  return {
    year,
    month,
    date,
    hours,
    minutes,
    seconds,
  };
}

export const stringToMs = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

export function humanToMs({ days = 0, hours = 0, minutes = 0, seconds = 0 }) {
  const d = +days;
  const h = +hours;
  const m = +minutes;
  const s = +seconds;
  if (!d && !h && !m && !s) {
    return new Error("Incorrect input while trying to convert humanToMs");
  }
  return (
    d * stringToMs.day +
    h * stringToMs.hour +
    m * stringToMs.minute +
    s * stringToMs.second
  );
}

export function relativeToHumanTime(ms) {
  const days = Math.floor(ms / stringToMs.day);
  const hours = Math.floor((ms % stringToMs.day) / stringToMs.hour);
  const minutes = Math.floor((ms % stringToMs.hour) / stringToMs.minute);
  const seconds = Math.floor((ms % stringToMs.minute) / stringToMs.second);

  function addZero(num) {
    return +num === 0 ? "00" : +num > 9 ? num.toString() : `0${num}`;
  }

  return {
    days: addZero(days),
    hours: addZero(hours),
    minutes: addZero(minutes),
    seconds: addZero(seconds),
  };
}

export function msTimeSpent(ms) {
  return Date.now() - ms;
}

export function timeRender(
  { days, hours, minutes, seconds },
  variant = "shortStr",
) {
  switch (variant) {
    case "titleStr":
      return +hours ? `${hours}:${minutes}` : `${minutes}:${seconds}`;
    case "fullStr":
      return `${+days ? `${days} Days, ` : ""}
      ${+hours ? `${hours} hr, ` : ""}
      ${+minutes ? `${minutes} min, ` : ""}
      ${+seconds ? `${seconds} sec` : ""}`;
    case "daysToHours":
      return `${+days * 24 + +hours} hours and ${minutes} minutes`;
    case "extendStr":
      return `${+days ? `${days} Days, ` : ""}
      ${+hours ? `${+hours} ${hours > 1 ? "hours" : "hour"}, ` : ""}
      ${
        +minutes ? `${+minutes} ${minutes > 1 ? "minutes" : "minute"} and ` : ""
      }
      ${+seconds ? `${+seconds} ${seconds > 1 ? "seconds" : "second"}` : ""}`;
    case "shortStr":
    default:
      return +days > 0
        ? `${days} Days, ${hours}:${minutes}:${seconds}`
        : +hours > 0
          ? `${minutes}:${seconds}`
        : `${hours}:${minutes}:${seconds}`;
  }
}
