import {
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Paper,
  makeStyles,
  ListItemSecondaryAction,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import SearchTwoToneIcon from "@material-ui/icons/SearchTwoTone";
import PlusOneIcon from "@material-ui/icons/PlusOne";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

const useStyles = makeStyles((theme) => ({
  searchPaper: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "88%",
    margin: theme.spacing(1),
  },
  searchInput: {
    margin: theme.spacing(1),
    flex: 1,
  },
  listRoot: {
    marginTop: theme.spacing(1),
    maxHeight: 450,
    overflow: "scroll",
    "& li": {
      borderRadius: "10px",
    },
    "& li:hover": {
      cursor: "pointer",
      backgroundColor: "#e3e3e3",
    },
    "& li:hover .MuiButtonBase-root": {
      display: "block",
      color: "#000",
    },
    "& .MuiButtonBase-root": {
      display: "none",
    },
    "& .MuiButtonBase-root:hover": {
      backgroundColor: "transparent",
    },
  },
}));

export default function SearchFoodItem(props) {
  const { values, setValues } = props;
  const [foodItems, setFoodItems] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [searchList, setSearchList] = useState([]);
  const classes = useStyles();
  let orderedFoodItems = values.orderDetails;

  // Get the list of food items
  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.FOODITEM)
      .fetchAll()
      .then((res) => {
        setFoodItems(res.data);
        setSearchList(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Filter the list with searchKey and if item is ordered then not show
  useEffect(() => {
    let items = [...foodItems];
    items = items.filter(
      (repoItems) =>
        repoItems.foodItemName
          .toLowerCase()
          .includes(searchKey.toLowerCase()) &&
        orderedFoodItems.every(
          // just show none-ordered items
          (orderedItem) => orderedItem.foodItemId !== repoItems.foodItemId
        )
    );
    setSearchList(items);
  }, [orderedFoodItems, foodItems, searchKey]);

  const addFoodItem = (foodItem) => {
    let orderDetail = {
      orderMasterId: values.orderMasterId,
      orderDetailId: 0,
      foodItemId: foodItem.foodItemId,
      quantity: 1,
      foodItemPrice: foodItem.price,
      foodItemName: foodItem.foodItemName || "",
    };
    setValues({
      ...values,
      orderDetails: [...values.orderDetails, orderDetail],
    });
  };

  return (
    <>
      <Paper className={classes.searchPaper}>
        <InputBase
          className={classes.searchInput}
          value={searchKey}
          onChange={(e) => setSearchKey(() => e.target.value)} // use arrow functions
          placeholder="Search food item"
        ></InputBase>
        <IconButton>
          <SearchTwoToneIcon></SearchTwoToneIcon>
        </IconButton>
      </Paper>
      <List className={classes.listRoot}>
        {searchList.map((foodItem, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={foodItem.foodItemName}
              secondary={foodItem.price}
            ></ListItemText>
            <ListItemSecondaryAction>
              <IconButton onClick={(e) => addFoodItem(foodItem)}>
                <PlusOneIcon></PlusOneIcon>
                <ArrowForwardIosIcon></ArrowForwardIosIcon>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  );
}
