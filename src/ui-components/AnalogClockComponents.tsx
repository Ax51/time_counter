import { styled } from "@mui/material";

export const Clock = styled("div", {
  shouldForwardProp: (prop) => prop !== "size" && prop !== "sx",
})<{ size: number }>(({ size, theme }) => ({
  width: size ?? 150,
  aspectRatio: "1",
  border: "7px solid #282828",
  borderRadius: "50%",
  margin: `${theme.spacing(3)} 0`,
  position: "relative",
  padding: 2,
  backgroundColor: "#006e53",
}));

export const OuterClockFace = styled("div")({
  position: "relative",
  width: "100%",
  height: "100%",
  borderRadius: "100%",
  background: "#282828",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    width: "5px",
    height: "100%",
    background: "#1df52f",
    zIndex: 0,
    left: "49%",
    transform: "rotate(90deg)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    width: "5px",
    height: "100%",
    background: "#1df52f",
    zIndex: 0,
    left: "49%",
  },
});
export const markingStyles = {
  position: "absolute",
  height: "100%",
  zIndex: 0,
  left: "49%",
  background: "#bdbdcb",
  width: "3px",
};

export const MarkOne = styled("div")({
  ...(markingStyles as Record<string, unknown>),
  transform: "rotate(30deg)",
});
export const MarkTwo = styled("div")({
  ...(markingStyles as Record<string, unknown>),
  transform: "rotate(60deg)",
});
export const MarkThree = styled("div")({
  ...(markingStyles as Record<string, unknown>),
  transform: "rotate(120deg)",
});
export const MarkFour = styled("div")({
  ...(markingStyles as Record<string, unknown>),
  transform: "rotate(150deg)",
});

export const InnerClockFace = styled("div")({
  position: "absolute",
  top: "10%",
  left: "10%",
  width: "80%",
  height: "80%",
  background: "#282828",
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
    background: "#4d4b63",
    zIndex: 11,
    transform: "translate(-50%, -50%)",
  },
});

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
  // transition: "1s linear",
  // transitionTimingFunction: "cubic-bezier(0.1, 2.7, 0.58, 1)",
};

export const HourHand = styled("div")({
  ...(handStyles as Record<string, unknown>),
  width: "30%",
  zIndex: 3,
});
export const MinuteHand = styled("div")({
  ...(handStyles as Record<string, unknown>),
  height: "3px",
  zIndex: 10,
  width: "40%",
});
export const SecondHand = styled("div")({
  ...(handStyles as Record<string, unknown>),
  background: "#ee791a",
  width: "45%",
  height: "2px",
});
