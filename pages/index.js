import { Inter } from "@next/font/google";
import { Box, Button, Typography } from "@mui/material";
import SelectField from "../components/SelectField";
import TextFieldComponent from "../components/TextField";
import axios from "axios";
import { useContext, useState } from "react";
import MainContext from "../context/mainContext";
import { useRouter } from "next/router";
import styled from "@emotion/styled";

const Container = styled.div`
  margin-top: 80px;
  position: fixed;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  border-radius: 5px;
  padding: 5rem;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
    rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
`;

axios.defaults.baseURL = "https://opentdb.com/";

export const getStaticProps = async () => {
  const response = await axios.get("/api_category.php");
  const categories = await response.data;

  return {
    props: {
      categories,
    },
  };
};

export default function Home({ categories }) {
  const [nameError, setNameError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [difficultyError, setDifficultyError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [amountError, setAmountError] = useState(false);

  const router = useRouter();

  const {
    category,
    difficulty,
    type,
    amount,
    loading,
    name,
    error,
    setUrl,
    dispatch,
    setName,
    getQuestions,
    validateField,
    ACTIONS,
  } = useContext(MainContext);

  const setCategory = (category) =>
    dispatch({ type: ACTIONS.SET_CATEGORY, payload: category });
  const setDifficulty = (difficulty) =>
    dispatch({ type: ACTIONS.SET_DIFFICULTY, payload: difficulty });
  const setType = (type) => dispatch({ type: ACTIONS.SET_TYPE, payload: type });
  const setAmount = (amount) =>
    dispatch({ type: ACTIONS.SET_AMOUNT, payload: amount });

  const difficultyOptions = [
    { id: "easy", name: "Easy" },
    { id: "medium", name: "Medium" },
    { id: "hard", name: "Hard" },
  ];

  const typeOptions = [
    { id: "multiple", name: "Multiple Choice" },
    { id: "boolean", name: "True/False" },
  ];

  const questionAmountOptions = [
    { id: "6", name: 6 },
    { id: "8", name: 8 },
    { id: "10", name: 10 },
  ];

  /* if (loading) {
    return (
      <Box mt={20}>
        <CircularProgress />
      </Box>
    );
  } */

  if (error) {
    return (
      <Typography variant="h6" mt={20} color="red">
        Something went wrong!
      </Typography>
    );
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    const isNameValid = validateField(name, setNameError);
    const isCategoryValid = validateField(category, setCategoryError);
    const isDifficultyValid = validateField(difficulty, setDifficultyError);
    const isTypeValid = validateField(type, setTypeError);
    const isAmountValid = validateField(amount, setAmountError);

    if (
      isNameValid &&
      isCategoryValid &&
      isDifficultyValid &&
      isTypeValid &&
      isAmountValid
    ) {
      //  setUrl(url);
      getQuestions();
      router.replace("/questions");
    } else {
      console.log("All fields must be full");
    }
  };

  return (
    <Container>
      <Typography variant="h2" color="black" fontWeight="bold">
        Quiz App
      </Typography>
      <form onSubmit={submitHandler}>
        <TextFieldComponent
          label="Name"
          setParam={setName}
          error={nameError}
          setError={setNameError}
          type="text"
        />
        <SelectField
          options={categories.trivia_categories}
          setParam={setCategory}
          label="Category"
          error={categoryError}
          setError={setCategoryError}
        />
        <SelectField
          options={difficultyOptions}
          setParam={setDifficulty}
          label="Difficulty"
          error={difficultyError}
          setError={setDifficultyError}
        />
        <SelectField
          options={typeOptions}
          setParam={setType}
          label="Type"
          error={typeError}
          setError={setTypeError}
        />
        <SelectField
          options={questionAmountOptions}
          setParam={setAmount}
          label="Amount of Questions"
          error={amountError}
          setError={setAmountError}
        />
        <Box mt={3} width="100%">
          <Button fullWidth variant="contained" type="submit">
            Get Started
          </Button>
        </Box>
      </form>
    </Container>
  );
}
