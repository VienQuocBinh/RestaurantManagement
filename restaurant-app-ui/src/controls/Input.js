import React from "react";
import { TextField } from "@material-ui/core";

export default function Input(props) {
  const {
    name,
    label,
    value,
    variant,
    onChange,
    error = null,
    ...other
  } = props;
  return (
    // đọc doc của MUI v4 tag <TextField> xem các props
    <TextField
      variant={variant || "outlined"}
      label={label}
      name={name}
      value={value}
      onChange={onchange}
      {...other}
      {...(error && { error: true, helperText: true })}
    ></TextField>
  );
}
