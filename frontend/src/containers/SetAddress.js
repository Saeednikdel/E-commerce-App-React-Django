import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { set_address, resetState } from "../actions/auth";
import { TextField, Button, LinearProgress } from "@material-ui/core";

const SetAddress = ({
  set_address,
  setOpenPopup,
  requestSuccess,
  requestFail,
  resetState,
  pid,
  pname,
  paddress,
  pzip_code,
  pphone,
}) => {
  const [formData, setFormData] = useState({
    id: pid,
    address: paddress,
    name: pname,
    zip_code: pzip_code,
    phone: pphone,
  });

  const { id, name, address, zip_code, phone } = formData;
  const [requestSent, setRequestSent] = useState(false);
  useEffect(() => {
    if (requestFail) {
      setRequestSent(false);
      resetState();
    }
    if (requestSuccess) {
      setOpenPopup(false);
      resetState();
    }
  }, [requestFail, requestSuccess]);
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    set_address(id, name, address, zip_code, phone);
    setRequestSent(true);
  };

  return (
    <div style={{ textAlign: "center" }}>
      {requestSent ? <LinearProgress /> : ""}
      <form onSubmit={(e) => onSubmit(e)}>
        <div style={{ marginTop: 5 }}>
          <TextField
            type="text"
            label="آدرس"
            name="address"
            value={address}
            multiline
            rows={4}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div style={{ marginTop: 5 }}>
          <TextField
            type="text"
            label="نام"
            name="name"
            value={name}
            multiline
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div style={{ marginTop: 5 }}>
          <TextField
            type="number"
            label="کد پستی"
            name="zip_code"
            value={zip_code}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div style={{ marginTop: 5 }}>
          <TextField
            type="number"
            label="تلفن"
            name="phone"
            value={phone}
            onChange={(e) => onChange(e)}
            required
          />
        </div>

        <Button
          type="submit"
          style={{ margin: 20 }}
          variant="contained"
          color="secondary"
        >
          تایید
        </Button>
      </form>
    </div>
  );
};
const mapStateToProps = (state) => ({
  requestSuccess: state.auth.requestSuccess,
  requestFail: state.auth.requestFail,
});
export default connect(mapStateToProps, { set_address, resetState })(
  SetAddress
);
