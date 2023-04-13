import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { decode } from "html-entities";
import { useRouter } from "next/router";
import {
  use,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import MainContext from "../context/mainContext";
import styled from "styled-components";
import CircularProgressBarWithMeter from "../components/CircularProgressBarWithMeter";
import { saveAs } from "file-saver";

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  width: 760px;
  height: 550px;
  overflow: hidden;
  // border: 1px solid black;
  margin: 0px 0px 0px 0px;
`;

const AnswerBoxes = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  margin: ${(props) =>
    props.isTF ? "100px 200px 0px 0px" : "50px 200px 0px 0px"};
`;

const AnswerBox = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 500px;
  height: 100px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 -4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0.5rem;

  &:hover {
    transform: scale(1.1);
  }

  &.correct {
    background-color: #00ff00;
  }

  &.wrong {
    background-color: #ff0000;
  }
`;

const Answer = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const Loading = styled.div`
  overflow: hidden;
`;

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const Questions = () => {
  const {
    error,
    questions,
    setScore,
    score,
    difficulty,
    type,
    amount,
    url,
    name,
    isTF,
    scoreProgress,
    setIsTF,
    points,
    setPoints,
    setOverallPoints,
    setScoreProgress,
  } = useContext(MainContext);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const nextQuestion = () => {
    setTimeout(() => {
      setQuestionIndex(questionIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }, 2000);
  };

  const playerScore = {
    name: name,
    score: points,
    difficulty: difficulty,
    questions: amount,
  };

  const savePlayerScore = async (data) => {
    const response = await fetch("http://localhost:5001/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.text();
    console.log(result);
  };

  const router = useRouter();
  const intervalRef = useRef();

  useEffect(() => {
    if (type === "boolean") {
      setIsTF(true);
    } else {
      setIsTF(false);
    }

    setProgress(0);
    setScoreProgress(0);
  }, []);

  useEffect(() => {
    if (count > 0.1) {
      intervalRef.current = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
    } else if (count === 0) {
      setIsButtonDisabled(true);
      setProgress((100 / questions.length) * (questionIndex + 1));

      if (questionIndex + 1 < questions.length) {
        nextQuestion();
      } else {
        setTimeout(() => {
          savePlayerScore(count);
          router.replace("/score");
        }, 1000);
      }
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [count]);

  useEffect(() => {
    setCount(10);
    setIsButtonDisabled(false);
  }, [questionIndex]);

  useEffect(() => {
    if (questions.length) {
      const question = questions[questionIndex];
      let answers = [...question.incorrect_answers];
      answers.splice(
        getRandomInt(question.incorrect_answers.length),
        0,
        question.correct_answer
      );
      setIsLoading(false);
      setOptions(answers);
    }
  }, [questions, questionIndex]);

  useEffect(() => {
    setScoreProgress((score / questions.length) * 100);
  }, [score]);

  if (isLoading) {
    return (
      <Loading>
        <Box mt={20}>
          <CircularProgress />
        </Box>
      </Loading>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" mt={20} color="red">
        Something went wrong!
      </Typography>
    );
  }

  const handleClickAnswer = (e) => {
    setProgress((100 / questions.length) * (questionIndex + 1));
    const question = questions[questionIndex];
    setIsButtonDisabled(true);

    if (e.target.textContent === question.correct_answer) {
      setOverallPoints(count);
      setScore(score + 1);
    }

    clearInterval(intervalRef.current);
    setCount(count);

    const answer = e.target.textContent;
    setSelectedAnswer(answer);
    setIsCorrect(answer === question.correct_answer);

    if (questionIndex + 1 < questions.length) {
      nextQuestion();
    } else {
      savePlayerScore(playerScore);
      setTimeout(() => {
        router.replace("/score");
      }, 1000);
    }
  };

  const disabledOnClick = () => {
    return null;
  };

  return (
    <Box>
      <Typography variant="h3">Question {questionIndex + 1}</Typography>
      <Typography mt={7} variant="h5">
        {decode(questions[questionIndex].question)}
      </Typography>
      <Container>
        <AnswerBoxes isTF={isTF}>
          {options.map((answer, id) => (
            <AnswerBox
              key={id}
              className={`answer-box ${
                selectedAnswer === answer && (isCorrect ? "correct" : "wrong")
              }`}
              onClick={isButtonDisabled ? disabledOnClick : handleClickAnswer}
            >
              <Answer>
                <Button disabled={isButtonDisabled} variant="text">
                  {decode(answer)}
                </Button>
              </Answer>
            </AnswerBox>
          ))}
        </AnswerBoxes>
        <Box mt={0} position="relative">
          <Box
            sx={{
              top: 40,
              left: 20,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
              sx={{ position: "absolute", top: -17, right: 85 }}
            >
              <h2>Score:</h2>
              <h2>{points.toFixed(0)}</h2>
            </Typography>
          </Box>
        </Box>
        <Box mt={14} position="relative">
          <Box
            sx={{
              top: 40,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
              sx={{ position: "absolute", top: -17, right: 85 }}
            >
              <h2>{`${score} - ${questions.length}`}</h2>
            </Typography>
          </Box>
          <CircularProgressBarWithMeter
            progress={scoreProgress}
            color="success"
          />
        </Box>
        <Box mt={32} position="relative">
          <CircularProgressBarWithMeter progress={progress} color="primary" />
        </Box>
        <Box mt={50} position="relative">
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 15,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
              sx={{ position: "absolute", right: 85 }}
            >
              <h2>{count}</h2>
            </Typography>
          </Box>
          <CircularProgressBarWithMeter
            progress={count * 10}
            color="secondary"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Questions;
