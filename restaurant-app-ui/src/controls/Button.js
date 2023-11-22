import React from "react";
import { Button as MuiButton, makeStyles } from "@material-ui/core";

// Define styles and class-name for the button
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiButton-label": {
      textTransform: "none",
    },
    margin: theme.spacing(1),
  },
}));

export default function Button(props) {
  const { children, color, variant, onClick, className, ...other } = props;
  const classes = useStyles();
  return (
    // Đọc doc MUI v4 để xem các props của tag <Button>
    <MuiButton
      className={classes.root + " " + (className || "")}
      variant={variant || "contained"}
      color={color || "default"}
      onClick={onClick}
      {...other}
    >
      {children}
    </MuiButton>
  );
}
