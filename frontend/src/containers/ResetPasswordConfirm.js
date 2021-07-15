import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { reset_password_confirm, resetState } from "../actions/auth";
import { TextField, Button, LinearProgress } from "@material-ui/core";

const ResetPasswordConfirm = ({
  requestSuccess,
  reset_password_confirm,
  match,
  resetState,
  requestFail,
}) => {
  const [requestSent, setRequestSent] = useState(false);

  const [formData, setFormData] = useState({
    new_password: "",
    re_new_password: "",
  });

  const { new_password, re_new_password } = formData;
  useEffect(() => {
    if (requestFail) {
      setRequestSent(false);
      resetState();
    }
    if (requestSuccess) {
      resetState();
    }
  }, [requestFail, requestSuccess]);
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const uid = match.params.uid;
    const token = match.params.token;

    reset_password_confirm(uid, token, new_password, re_new_password);
    setRequestSent(true);
  };
  if (requestSent === requestSuccess) return <Redirect to="/" />;
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
            minLength="6"
            required
          />
        </div>
        <div>
          <TextField
            type="password"
            label="تکرار رمز عبور"
            name="re_new_password"
            value={re_new_password}
            onChange={(e) => onChange(e)}
            minLength="6"
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
export default connect(mapStateToProps, { reset_password_confirm, resetState })(
  ResetPasswordConfirm
);
