import { makeStyles } from "@material-ui/core";
import React from "react";

// Define styles and class-name for the form-control
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      width: "90%",
      margin: theme.spacing(1),
    },
  },
}));

export default function Form(props) {
  const classes = useStyles();
  const { children, ...other } = props;
  return (
    // Each form-control is a child of <Form>
    <form className={classes.root} noValidate autoComplete="off" {...other}>
      {props.children}
    </form>
  );
}
