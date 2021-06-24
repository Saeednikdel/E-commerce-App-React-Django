import React, { useEffect } from "react";
import { connect } from "react-redux";
import { load_address } from "../actions/shop";
import {
  /// Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio, CircularProgress,
} from "@material-ui/core";

const Addresses = ({ addresses, load_address }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        await load_address(localStorage.getItem("id"));
      } catch (err) {}
    };
    if (localStorage.getItem("id")) {
      fetchData();
    }
  }, []);

  const handleChange = (event) => {
    /// setSelectedValue(event.target.value);
    console.log("cheked ", event.currentTarget);
  };

  return addresses ? (
    <div style={{ margin: 20 }}>
      <TableContainer>
        <Table aria-label="orders">
          <TableHead>
            <TableRow>
              <TableCell>آدرس</TableCell>
              <TableCell>کد پستی</TableCell>
              <TableCell>تلفن</TableCell>
              <TableCell>پیش فرض</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addresses.map((address) => (
              <TableRow key={address.id}>
                <TableCell>{address.address}</TableCell>
                <TableCell>{address.zip_code}</TableCell>
                <TableCell>{address.phone}</TableCell>
                <TableCell>
                  <Radio
                    onChange={handleChange}
                    value={address.id}
                    checked={address.default}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  ) : (
        <CircularProgress color="secondary"/>

  );
};
const mapStateToProps = (state) => ({
  addresses: state.shop.address,
});
export default connect(mapStateToProps, { load_address })(Addresses);
