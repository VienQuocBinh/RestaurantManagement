import OrderForm from "./OrderForm";
import { useForm } from "../../hooks/useForm";
import { Grid } from "@material-ui/core";
import SearchFoodItem from "./SearchFoodItem";
import OrderedFoodItem from "./OrderedFoodItems";

// Random 6 so
const generateOrderNumber = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Default values of the OrderMaster
const getFreshModelObject = () => ({
  orderMasterId: 0,
  orderNumber: generateOrderNumber(),
  customerId: 0,
  pMethod: "none",
  gTotal: 0,
  deletedOrderItemIds: "",
  foodItemName: "",
  orderDetails: [],
});

export default function Order() {
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetFormControls,
  } = useForm(getFreshModelObject);

  return (
    <Grid container>
      <Grid item xs={12}>
        <OrderForm
          {...{
            values,
            setValues,
            errors,
            setErrors,
            resetFormControls,
            handleInputChange,
          }}
        ></OrderForm>
      </Grid>
      <Grid item xs={6}>
        <SearchFoodItem {...{ values, setValues }}></SearchFoodItem>
      </Grid>
      <Grid item xs={6}>
        <OrderedFoodItem
          {...{
            values,
            setValues,
          }}
        ></OrderedFoodItem>
      </Grid>
    </Grid>
  );
}
