import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useState } from "react";
import MainContext from "../context/mainContext";

const SelectField = ({ label, options, setParam, setError, error }) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    setParam(e.target.value);
    setError(false);
  };

  return (
    <Box mt={3} width="100%" bgcolor="white">
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          label={label}
          onChange={handleChange}
          error={error}
        >
          {options.map(({ id, name }) => (
            <MenuItem value={id} key={id}>
              {name}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText error>Please select input!</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default SelectField;
