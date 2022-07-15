export default function timeRender(
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
        : `${hours}:${minutes}:${seconds}`;
  }
}
