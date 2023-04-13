import styled from "styled-components";
import Profiles from "./Profile";
import Results from "../backend/database.json";
import { useContext, useEffect, useState } from "react";
import MainContext from "../context/mainContext";
import { Typography } from "@mui/material";

export default function Leaderboard() {
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedQuestionType, setSelectedQuestionType] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const { difficulty, amount, name, score, questions, points } =
    useContext(MainContext);
  const [mostRecent, setMostRecent] = useState();

  function getMostRecent(data) {
    let mostRecentEntry = data.sort((a, b) => b.created_at - a.created_at);
    const mostRecentValue = mostRecentEntry[0];

    setMostRecent(mostRecentValue);
  }

  function getMatchingObjects(objects, properties) {
    if (!Array.isArray(objects)) {
      objects = [objects];
    }

    let matchingObjects = objects
      .map((object) => {
        let match = true;

        for (const [property, value] of Object.entries(properties)) {
          if (object[property] !== value) {
            match = false;
            break;
          }
        }
        return match ? object : undefined;
      })
      .filter((object) => object);

    matchingObjects.sort((a, b) => b.score - a.score);

    return { matchingResults: matchingObjects };
  }

  useEffect(() => {});

  function filterResults(questionAmount, difficulty) {
    const properties = {};

    if (questionAmount) {
      properties.questions = questionAmount;
    }

    if (difficulty) {
      properties.difficulty = difficulty;
    }

    const { matchingResults } = getMatchingObjects(Results, properties);
    setFilteredResults(matchingResults);
    //  setMostRecent(mostRecent);
  }

  useEffect(() => {
    filterResults(amount, difficulty);
    getMostRecent(Results);
  }, []);

  const handleQuestionsClick = (e) => {
    setSelectedQuestionType(e.target.id);
    filterResults(e.target.id, selectedDifficulty);
  };

  const handleDifficultyClick = (e) => {
    setSelectedDifficulty(e.target.id);
    filterResults(selectedQuestionType, e.target.id);
  };

  return (
    <Board>
      <LeaderboardHeader>Leaderboard</LeaderboardHeader>
      <UserResults>
        <UserResult>
          Questions Correct: {score} / {questions.length}
        </UserResult>
        <br />
        <UserResult>Final Score: {points.toFixed(0)}</UserResult>
      </UserResults>
      <Settings>
        <Button
          onClick={handleQuestionsClick}
          id="6"
          className={selectedQuestionType === "6" ? "selected" : ""}
        >
          6 Questions
        </Button>
        <Button
          onClick={handleQuestionsClick}
          id="8"
          className={selectedQuestionType === "8" ? "selected" : ""}
        >
          8 Questions
        </Button>
        <Button
          onClick={handleQuestionsClick}
          id="10"
          className={selectedQuestionType === "10" ? "selected" : ""}
        >
          10 Questions
        </Button>
      </Settings>
      <Settings>
        <Button
          onClick={handleDifficultyClick}
          id="easy"
          className={selectedDifficulty === "easy" ? "selected" : ""}
        >
          Easy
        </Button>
        <Button
          onClick={handleDifficultyClick}
          id="medium"
          className={selectedDifficulty === "medium" ? "selected" : ""}
        >
          Medium
        </Button>
        <Button
          onClick={handleDifficultyClick}
          id="hard"
          className={selectedDifficulty === "hard" ? "selected" : ""}
        >
          Hard
        </Button>
      </Settings>
      <br />
      <Profiles data={filteredResults} mostRecent={mostRecent}></Profiles>
    </Board>
  );
}

const Board = styled.div`
  text-align: center;
  font-family: "Poppins", cursive;
  margin: 0;
  padding: 1rem;
`;

const UserResults = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px;
`;

const UserResult = styled.div`
  margin: 15px;
`;

const LeaderboardHeader = styled.h1`
  margin-bottom: 1em;
`;

const Settings = styled.div`
  display: block;
  justify-content: center;
  gap: 1em;
`;

const Button = styled.button`
  border: 1px solid black;
  padding: 0.5em 2em;
  margin: 0.3rem;
  border-radius: 50px;
  background-color: transparent;
  cursor: pointer;

  &.selected {
    background: gray;
  }

  &:hover {
    background-color: gray;
    color: white;
  }
`;
