import React, { useState, useEffect } from "react";
import Form from "../layouts/Form";
import {
  Grid,
  InputAdornment,
  makeStyles,
  ButtonGroup,
  Button as MuiButton,
} from "@material-ui/core";
import { Input, Select, Button } from "../../controls";
import ReplayIcon from "@material-ui/icons/Replay";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import ReorderIcon from "@material-ui/icons/Reorder";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import { roundTo2DecimalPoint } from "../../utils";
import Popup from "../layouts/Popup";
import OrderList from "./OrderList";
import Notification from "../layouts/Notification";

// const customers = [
//   { id: 0, title: "Select" },
//   { id: 1, title: "Customer1" },
//   { id: 2, title: "Customer2" },
//   { id: 3, title: "Customer3" },
//   { id: 4, title: "Customer4" },
// ];

const pMethods = [
  { id: "none", title: "Select" },
  { id: "Cash", title: "Cash" },
  { id: "Card", title: "Card" },
];

const useStyles = makeStyles((theme) => ({
  // style the icons of orderNumber and gTotal
  adornmentText: {
    "& .MuiTypography-root": {
      color: "#f3b33d",
      fontWeight: "bolder",
      fontSize: "1.2em",
    },
  },
  submitButtonGroup: {
    "& .MuiButton-label": {
      textTransform: "none",
    },
    "&:hover": {
      backgroundColor: "#f3b33d",
    },
    margin: theme.spacing(1),
    backgroundColor: "#f3b33d",
    color: "#000",
  },
}));

export default function OrderForm(props) {
  const {
    values,
    setValues,
    errors,
    setErrors,
    resetFormControls,
    handleInputChange,
  } = props;
  const classes = useStyles();

  const [customers, setCustomers] = useState([]);
  const [orderListVisibility, setOrderListVisibility] = useState(false);
  const [orderId, setOrderId] = useState(0);
  const [notify, setNotify] = useState({ isOpen: false });

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.CUSTOMER)
      .fetchAll()
      .then((res) => {
        let customers = res.data.map((customer) => ({
          id: customer.customerId,
          title: customer.customerName,
        }));
        customers = [{ id: 0, title: "Select" }].concat(customers);
        setCustomers(() => customers); // use arrow functions
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    /*
    reduce: execute the callback function on each element inside the array
    reduce: output a single value
    tempTotal is the var to store the result after each iteration
    init tempTotal = 0
    */

    let gTotal = values.orderDetails.reduce((tempTotal, item) => {
      return roundTo2DecimalPoint(
        tempTotal + item.quantity * item.foodItemPrice
      );
    }, 0);
    setValues({ ...values, gTotal: gTotal });
  }, [JSON.stringify(values.orderDetails)]);

  useEffect(() => {
    if (orderId === 0) {
      resetFormControls();
    } else {
      createAPIEndpoint(ENDPOINTS.ORDER)
        .fetchById(orderId)
        .then((res) => {
          setValues(res.data);
          setErrors("");
        })
        .catch((err) => console.log(err));
    }
  }, [orderId]);

  const validateForm = () => {
    let temp = {};
    temp.customerId = values.customerId !== 0 ? "" : "This field is required";
    temp.pMethod = values.pMethod !== "none" ? "" : "This field is required";
    temp.orderDetails =
      values.orderDetails.length !== 0 ? "" : "This field is required";

    setErrors({ ...temp });
    // if temp array is empty return true
    // if temp array is not empty return false
    return Object.values(temp).every((x) => x === "");
  };

  const resetForm = () => {
    resetFormControls();
    setOrderId(0);
  };

  const submitOrder = (e) => {
    e.preventDefault();
    // if all inputs in form are valid
    if (validateForm()) {
      // if order is not selected/existed (not set the id) --> create
      if (values.orderMasterId === 0) {
        createAPIEndpoint(ENDPOINTS.ORDER)
          .create(values)
          .then((res) => {
            resetFormControls();
            setNotify({ isOpen: true, message: "Added successfully" });
          })
          .catch((err) => console.log(err));
      } else {
        // if order is selected/existed (set the id) --> update
        createAPIEndpoint(ENDPOINTS.ORDER)
          .update(values.orderMasterId, values)
          .then((res) => {
            setOrderId(0);
            setNotify({ isOpen: true, message: "Updated successfully" });
          })
          .catch((err) => console.log(err));
      }
    }
  };

  const openListOfOrders = () => {
    setOrderListVisibility(true);
  };

  return (
    <>
      <Form onSubmit={submitOrder}>
        <Grid container>
          <Grid item xs={6}>
            {/* .MuiFormControl-root */}
            <Input
              disabled
              label="Order number"
              name="orderNumber"
              value={values.orderNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    className={classes.adornmentText}
                    position="start"
                  >
                    #
                  </InputAdornment>
                ),
              }}
            />
            {/* .MuiFormControl-root */}
            <Select
              label="Customer"
              name="customerId"
              value={values.customerId}
              options={customers}
              onChange={handleInputChange}
              error={errors.customerId}
            ></Select>
          </Grid>
          <Grid item xs={6}>
            {/* .MuiFormControl-root */}
            <Input
              disabled
              label="Grand total"
              name="gTotal"
              value={values.gTotal}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    className={classes.adornmentText}
                    position="start"
                  >
                    $
                  </InputAdornment>
                ),
              }}
            />
            {/* .MuiFormControl-root */}
            <Select
              label="Payment method"
              name="pMethod"
              value={values.pMethod}
              options={pMethods}
              onChange={handleInputChange}
              error={errors.pMethod}
            ></Select>
            <ButtonGroup className={classes.submitButtonGroup}>
              {/* Submit and Reset button */}
              <MuiButton
                endIcon={<RestaurantIcon></RestaurantIcon>}
                size="large"
                type="submit"
              >
                Submit
              </MuiButton>
              <MuiButton
                onClick={resetForm}
                size="small"
                startIcon={<ReplayIcon></ReplayIcon>}
              ></MuiButton>
            </ButtonGroup>
            {/* Order button */}
            <Button
              size="large"
              onClick={openListOfOrders}
              startIcon={<ReorderIcon></ReorderIcon>}
            >
              Orders
            </Button>
          </Grid>
        </Grid>
      </Form>
      <Popup
        title="List of Orders"
        openPopup={orderListVisibility}
        setOpenPopup={setOrderListVisibility}
      >
        <OrderList
          {...{
            setOrderId,
            setOrderListVisibility,
            resetFormControls,
            setNotify,
          }}
        ></OrderList>
      </Popup>
      <Notification {...{ notify, setNotify }}></Notification>
    </>
  );
}
