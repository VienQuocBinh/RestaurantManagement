import { makeStyles, Table as MuiTable } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  table: {
    "& tbody td": {
      fontWeight: "400",
    },
    "& tbody tr:hover": {
      backgroundColor: "#fffbf2",
      cursor: "pointer",
    },
    "& .MuiTableCell-root": {
      border: "none",
    },
  },
}));

export default function Table(props) {
  const classes = useStyles();

  return <MuiTable className={classes.table}>{props.children}</MuiTable>;
}
