import { styled } from "@mui/material";

export const Clock = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "size" &&
    prop !== "color" &&
    prop !== "sx" &&
    prop !== "minutesColor",
})<{ size: number; color: string; minutesColor: string }>(
  ({ size, color, minutesColor, theme }) => ({
    width: size ?? 150,
    aspectRatio: "1",
    // NOTE: case color
    border: `7px solid ${color}`,
    borderRadius: "50%",
    margin: `${theme.spacing(3)} 0`,
    position: "relative",
    padding: 2,
    // NOTE: minutes color
    backgroundColor: minutesColor,
  }),
);

export const OuterClockFace = styled("div", {
  shouldForwardProp: (prop) => prop !== "color" && prop !== "hourColor",
})<{ color: string; hourColor: string }>(({ color, hourColor }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  borderRadius: "100%",
  // NOTE: escapeWheel color
  background: color,
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    width: "5px",
    height: "100%",
    // NOTE: quaterHours color
    background: hourColor,
    zIndex: 0,
    left: "49%",
    transform: "rotate(90deg)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    width: "5px",
    height: "100%",
    // NOTE: quaterHours color
    background: hourColor,
    zIndex: 0,
    left: "49%",
  },
}));
export const markingStyles = {
  position: "absolute",
  height: "100%",
  zIndex: 0,
  left: "49%",
  // NOTE: hours color
  background: "#bdbdcb",
  width: "3px",
};

export const MarkOne = styled("div", {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>(({ color }) => ({
  ...(markingStyles as Record<string, unknown>),
  bacground: color,
  transform: "rotate(30deg)",
}));
export const MarkTwo = styled("div", {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>(({ color }) => ({
  ...(markingStyles as Record<string, unknown>),
  bacground: color,
  transform: "rotate(60deg)",
}));
export const MarkThree = styled("div", {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>(({ color }) => ({
  ...(markingStyles as Record<string, unknown>),
  bacground: color,
  transform: "rotate(120deg)",
}));
export const MarkFour = styled("div", {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>(({ color }) => ({
  ...(markingStyles as Record<string, unknown>),
  bacground: color,
  transform: "rotate(150deg)",
}));

export const InnerClockFace = styled("div", {
  shouldForwardProp: (prop) => prop !== "color" && prop !== "dialColor",
})<{ color: string; dialColor: string }>(({ color, dialColor }) => ({
  position: "absolute",
  top: "10%",
  left: "10%",
  width: "80%",
  height: "80%",
  // NOTE: body color
  background: color,
  borderRadius: "100%",
  zIndex: 1,
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "16px",
    height: "16px",
    borderRadius: "18px",
    // NOTE: dial color
    background: dialColor,
    zIndex: 11,
    transform: "translate(-50%, -50%)",
  },
}));

export const handStyles = {
  width: "50%",
  right: "50%",
  height: "6px",
  background: "#61afff",
  position: "absolute",
  top: "50%",
  borderRadius: "6px",
  transformOrigin: "100%",
  transform: "rotate(90deg)",
};

export const HourHand = styled("div", {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>(({ color = "#61afff" }) => ({
  ...(handStyles as Record<string, unknown>),
  backgroundColor: color,
  width: "30%",
  zIndex: 3,
}));

export const MinuteHand = styled("div", {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>(({ color = "#61afff" }) => ({
  ...(handStyles as Record<string, unknown>),
  backgroundColor: color,
  height: "3px",
  zIndex: 10,
  width: "40%",
}));

export const SecondHand = styled("div", {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>(({ color = "#ee791a" }) => ({
  ...(handStyles as Record<string, unknown>),
  backgroundColor: color,
  width: "45%",
  height: "2px",
}));
