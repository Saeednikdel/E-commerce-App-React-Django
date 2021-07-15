import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { set_email, resetState } from "../actions/auth";
import { TextField, Button, LinearProgress } from "@material-ui/core";

const SetEmail = ({
  set_email,
  setOpenPopup,
  requestSuccess,
  requestFail,
  resetState,
}) => {
  const [formData, setFormData] = useState({
    new_email: "",
    re_new_email: "",
    current_password: "",
  });

  const { new_email, re_new_email, current_password } = formData;
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
    set_email(new_email, re_new_email, current_password);
    setRequestSent(true);
  };

  return (
    <div style={{ textAlign: "center" }}>
      {requestSent ? <LinearProgress /> : ""}
      <form onSubmit={(e) => onSubmit(e)}>
        <div>
          <TextField
            type="email"
            label="ایمیل جدید"
            name="new_email"
            value={new_email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div>
          <TextField
            type="email"
            label="تکرار ایمیل"
            name="re_new_email"
            value={re_new_email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div>
          <TextField
            type="password"
            label="رمز عبور"
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
export default connect(mapStateToProps, { set_email, resetState })(SetEmail);
