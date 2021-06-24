import React from "react";
import {
  // Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

function Messages() {
  return (
    <div style={{ margin: 20 }}>
      <TableContainer>
        <Table aria-label="orders">
          <TableHead>
            <TableRow>
              <TableCell>کد تیکت</TableCell>
              <TableCell>تاریخ</TableCell>
              <TableCell>موضوع</TableCell>
              <TableCell>وضعیت</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {rows.map((row) => ( */}
            <TableRow key="row.name">
              <TableCell>۲۱۳۱۲۳</TableCell>
              <TableCell>۱۲/۱۱/۱۳۹۹</TableCell>
              <TableCell>شکایت</TableCell>
              <TableCell>منتظر پاسخ</TableCell>
            </TableRow>
            <TableRow key="row.سس">
              <TableCell>۲۱۳۱۲۳</TableCell>
              <TableCell>۱۲/۱۱/۱۳۹۹</TableCell>
              <TableCell>شکایت</TableCell>
              <TableCell>منتظر پاسخ</TableCell>
            </TableRow>
            {/* ))} */}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Messages;
