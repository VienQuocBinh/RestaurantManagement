import {
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import Table from "../layouts/Table";
import DeleteOutlineTwoToneIcon from "@material-ui/icons/DeleteOutlineTwoTone";
import ConfirmDialog from "../layouts/ConfirmDialog";

export default function OrderList(props) {
  const { setOrderId, setOrderListVisibility, resetFormControls, setNotify } =
    props;

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  // Get all Orders
  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.ORDER)
      .fetchAll()
      .then((res) => {
        setOrderList(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const [orderList, setOrderList] = useState([]);

  // Set selected orderId and Hide popup orderList
  const showForUpdate = (id) => {
    setOrderId(id);
    setOrderListVisibility(false);
  };

  const deleteOrder = (id) => {
    // if (window.confirm("Are you sure you want to delete")) {
    createAPIEndpoint(ENDPOINTS.ORDER)
      .delete(id)
      .then((res) => {
        setOrderListVisibility(false);
        setOrderId(0);
        setNotify({ isOpen: true, message: "Deleted successfully" });
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        resetFormControls();
      })
      .catch((err) => console.log(err));
    // }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Order No.</TableCell>
          <TableCell>Customer</TableCell>
          <TableCell>Pay method</TableCell>
          <TableCell>Total</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orderList.map((item) => (
          <TableRow key={item.orderMasterId}>
            <TableCell onClick={() => showForUpdate(item.orderMasterId)}>
              {item.orderNumber}
            </TableCell>
            <TableCell onClick={() => showForUpdate(item.orderMasterId)}>
              {item.customer.customerName}
            </TableCell>
            <TableCell onClick={() => showForUpdate(item.orderMasterId)}>
              {item.pMethod}
            </TableCell>
            <TableCell onClick={() => showForUpdate(item.orderMasterId)}>
              {item.gTotal}
            </TableCell>
            <TableCell>
              <IconButton
                onClick={() =>
                  // deleteOrder(item.orderMasterId)
                  setConfirmDialog({
                    isOpen: true,
                    title: "Are you sure you want to delete",
                    subTitle: "You can undo this operation",
                    onConfirm: () => {
                      deleteOrder(item.orderMasterId);
                    },
                  })
                }
              >
                <DeleteOutlineTwoToneIcon color="secondary"></DeleteOutlineTwoToneIcon>
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      ></ConfirmDialog>
    </Table>
  );
}
