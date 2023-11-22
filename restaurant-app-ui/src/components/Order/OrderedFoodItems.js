import {
  Button,
  ButtonGroup,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  makeStyles,
} from "@material-ui/core";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import { roundTo2DecimalPoint } from "../../utils";

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    margin: "15px 0px",
    "&:hover": {
      cursor: "pointer",
    },
    "&:hover $deleteButton": {
      display: "block",
    },
  },
  // Group buttons + and -
  buttonGroup: {
    backgroundColor: "#e3e3e3",
    borderRadius: 10,
    "& .MuiButtonBase-root": {
      border: "none",
      minWidth: "25px",
      padding: "1px",
    },
    // style of the quantity number
    "& button:nth-child(2)": {
      fontSize: "1.2em",
      color: "#000",
    },
  },
  deleteButton: {
    display: "none",
    "& .MuiButtonBase-root": {
      color: "#e81719",
    },
  },
  totalPerItem: {
    fontWeight: "bolder",
    fontSize: "1.2em",
    margin: "2px 10px",
  },
}));

export default function OrderedFoodItem(props) {
  const { values, setValues } = props;
  const classes = useStyles();
  let orderedFoodItems = values.orderDetails;

  // Update quantity base on index
  const updateQuantity = (index, value) => {
    let x = { ...values };
    let foodItem = x.orderDetails[index];
    if (foodItem.quantity + value > 0) {
      foodItem.quantity += value;
      // console.log(x);
      setValues({ ...x });
    }
  };

  // Filter again food details list => add deletedOrderItemIds to string for BE split string then delete
  // set Values.orderDetails => call every useEffect hooks which depend on values/orderDetails => filter again search list
  const removeFoodItem = (index, orderDetailId) => {
    let x = { ...values };
    x.orderDetails = x.orderDetails.filter((_, i) => i !== index);
    if (orderDetailId !== 0) {
      x.deletedOrderItemIds += orderDetailId + ",";
    }
    setValues({ ...x });
  };
  return (
    // List all FoodItems in OrderedFoodItem (orderDetails)
    <List>
      {orderedFoodItems.length === 0 ? (
        <ListItem>
          <ListItemText
            primary="Please select food item(s)"
            primaryTypographyProps={{
              style: {
                textAlign: "center",
                fontStyle: "italic",
              },
            }}
          ></ListItemText>
        </ListItem>
      ) : (
        orderedFoodItems.map((item, index) => (
          <Paper key={item.foodItemId} className={classes.paperRoot}>
            {/* <Paper key={index}> */}
            <ListItem>
              <ListItemText
                primary={item.foodItemName}
                primaryTypographyProps={{
                  component: "h1",
                  style: {
                    fontSize: "1.2em",
                    fontWeight: "500",
                  },
                }}
                secondary={
                  <>
                    <ButtonGroup size="small" className={classes.buttonGroup}>
                      <Button onClick={(e) => updateQuantity(index, -1)}>
                        -
                      </Button>
                      <Button disabled>{item.quantity}</Button>
                      <Button onClick={(e) => updateQuantity(index, 1)}>
                        +
                      </Button>
                    </ButtonGroup>
                    <span className={classes.totalPerItem}>
                      {"$" +
                        roundTo2DecimalPoint(
                          item.quantity * item.foodItemPrice
                        )}
                    </span>
                  </>
                }
                secondaryTypographyProps={{
                  component: "div", // if not: show error <p> can not contains <div>
                }}
              ></ListItemText>
              <ListItemSecondaryAction>
                <IconButton
                  disableRipple
                  onClick={() => removeFoodItem(index, item.orderDetailId)}
                >
                  <DeleteTwoToneIcon
                    className={classes.deleteButton}
                  ></DeleteTwoToneIcon>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Paper>
        ))
      )}
    </List>
  );
}
