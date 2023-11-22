import React from "react";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";

export default function Select(props) {
  const {
    name,
    label,
    value,
    variant,
    onChange,
    options,
    error = null,
  } = props;

  return (
    <FormControl
      variant={variant || "outlined"}
      {...(error && { error: true })}
    >
      <InputLabel>{label}</InputLabel>
      {/* Alias MuiSelect */}
      <MuiSelect label={label} name={name} value={value} onChange={onChange}>
        {/* List all options each of them is MenuItem */}
        {options.map((option) => (
          // MenuItem has 2 props is 'id' and 'title'
          <MenuItem key={option.id} value={option.id}>
            {option.title}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
