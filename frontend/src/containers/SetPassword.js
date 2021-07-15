import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { set_password, resetState } from "../actions/auth";
import { TextField, Button, LinearProgress } from "@material-ui/core";

const SetPassword = ({
  set_password,
  setOpenPopup,
  requestSuccess,
  resetState,
  requestFail,
}) => {
  const [formData, setFormData] = useState({
    new_password: "",
    re_new_password: "",
    current_password: "",
  });
  const [requestSent, setRequestSent] = useState(false);

  const { new_password, re_new_password, current_password } = formData;
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
    set_password(new_password, re_new_password, current_password);
    setRequestSent(true);
  };

  return (
    <div style={{ textAlign: "center" }}>
      {requestSent ? <LinearProgress /> : ""}
      <form onSubmit={(e) => onSubmit(e)}>
        <div>
          <TextField
            type="password"
            label="رمز عبور جدید"
            name="new_password"
            value={new_password}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div>
          <TextField
            type="password"
            label="تکرار رمز جدید"
            name="re_new_password"
            value={re_new_password}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div>
          <TextField
            type="password"
            label="رمز عبور فعلی"
            name="current_password"
            value={current_password}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <Button
          style={{ margin: 20 }}
          variant="contained"
          color="secondary"
          type="submit"
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
export default connect(mapStateToProps, { set_password, resetState })(
  SetPassword
);
