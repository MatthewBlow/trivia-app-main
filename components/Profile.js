import React, { useContext } from "react";
import styled from "styled-components";
import MainContext from "../context/mainContext";

export default function Profiles({ data, mostRecent }) {
  return (
    <>
      {data.map((value, index) => (
        <Flex
          key={index}
          className={
            mostRecent?.created_at === value?.created_at ? "highlight" : ""
          }
        >
          <ItemStyle>
            <Info>
              <TextDark>{value.name}</TextDark>
            </Info>
          </ItemStyle>
          <ItemStyle>
            <span>{value.score}</span>
          </ItemStyle>
        </Flex>
      ))}
    </>
  );
}

const Info = styled.div`
  padding: 1rem;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1em;
  text-align: left;
  margin-bottom: 2em;
  width: 450px;
  padding-right: 12px;

  &.highlight {
    background-color: #12b53e;
  }
`;

const ItemStyle = styled.div`
  display: flex;
  align-items: center;
`;

const TextDark = styled.h3`
  color: black;
`;
