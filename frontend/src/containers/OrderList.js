import React from "react";
import {
  /// Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

const OrderList = () => {
  return (
    <div style={{ margin: 20 }}>
      <TableContainer>
        <Table aria-label="orders">
          <TableHead>
            <TableRow>
              <TableCell>کد سفارش</TableCell>
              <TableCell>تاریخ</TableCell>
              <TableCell>مبلغ</TableCell>
              <TableCell>وضعیت</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {rows.map((row) => ( */}
            <TableRow key="row.name">
              <TableCell>۲۱۳۱۲۳</TableCell>
              <TableCell>۱۲/۱۱/۱۳۹۹</TableCell>
              <TableCell>۲۵۰۰۰۰۰</TableCell>
              <TableCell>ارسال شده</TableCell>
            </TableRow>
            {/* ))} */}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default OrderList;
