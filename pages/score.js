import { Button, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useState } from "react";
import MainContext from "../context/mainContext";
import { useRouter } from "next/router";
import styled from "styled-components";
import Leaderboard from "../components/Leaderboard";

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
    rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
`;

const FinalScreen = () => {
  const {
    score,
    questions,
    points,
    setPoints,
    setScore,
    setQuestions,
    dispatch,
    initialState,
    setScoreProgress,
    ACTIONS,
  } = useContext(MainContext);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleBackToMenu = () => {
    setIsLoading(true);
    setQuestions([]);
    setScore(0);
    setPoints(0);
    setScoreProgress(0);
    dispatch({ type: ACTIONS.RESET_ALL });
    router.replace("/");
    // setIsLoading(false)
  };

  const Loading = styled.div`
    overflow: hidden;
  `;

  if (isLoading) {
    return (
      <Loading>
        <Box mt={20}>
          <CircularProgress />
        </Box>
      </Loading>
    );
  }

  return (
    <Main>
      <Leaderboard />
      <Button
        onClick={handleBackToMenu}
        variant="outlined"
        style={{ marginBottom: 20 }}
      >
        Back to Main Menu!
      </Button>
    </Main>
  );
};

export default FinalScreen;
