import { CircularProgress } from "@mui/material";
import styled from "styled-components";

const Children = styled.h2`
  position: absolute;
  top: 0;
  right: 30;
  color: black;
`;

const CircularProgressBarWithMeter = ({ progress, color, children }) => {
  return (
    <div>
      <CircularProgress
        size="8rem"
        variant="static"
        value={100}
        style={{
          color: "#D3D3D3",
          position: "absolute",
          top: 0,
          right: 30,
        }}
      />
      {children}
      <CircularProgress
        size="8rem"
        variant="determinate"
        value={progress}
        color={color}
        style={{ position: "absolute", right: 30 }}
      />
    </div>
  );
};

export default CircularProgressBarWithMeter;
