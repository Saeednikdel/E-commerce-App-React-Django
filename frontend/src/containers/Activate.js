import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { verify } from "../actions/auth";
import { Button, Typography } from "@material-ui/core";

const Activate = (props) => {
  const [verified, setVerified] = useState(false);

  const verify_account = (e) => {
    const uid = props.match.params.uid;
    const token = props.match.params.token;

    props.verify(uid, token);
    setVerified(true);
  };

  if (verified) return <Redirect to="/" />;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "200px",
      }}
    >
      <Typography variant="h5">تایید ایمیل</Typography>
      <Button
        style={{ margin: 20 }}
        type="submit"
        variant="contained"
        color="secondary"
        onClick={verify_account}
        type="button"
      >
        تایید
      </Button>
    </div>
  );
};

export default connect(null, { verify })(Activate);
