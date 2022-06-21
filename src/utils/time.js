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

export function relativeToHumanTime(ms) {
  const days = Math.floor(ms / stringToMs.day);
  const hours = Math.floor((ms % stringToMs.day) / stringToMs.hour);
  const minutes = Math.floor((ms % stringToMs.hour) / stringToMs.minute);
  const seconds = Math.floor((ms % stringToMs.minute) / stringToMs.second);

  function addZero(num) {
    return +num === 0 ? "00" : +num > 9 ? num.toString() : `0${num}`;
  }

  return {
    days: addZero(days, "day"),
    hours: addZero(hours, "hour"),
    minutes: addZero(minutes, "minute"),
    seconds: addZero(seconds, "second"),
  };
}

export function msTimeSpent(ms) {
  return +new Date() - ms;
}
