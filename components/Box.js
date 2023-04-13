import styled from "styled-components";

const Box = ({ children, style }) => {
  return (
    <div className="box" style={{ style }}>
      {children}
    </div>
  );
};

export default Box;
