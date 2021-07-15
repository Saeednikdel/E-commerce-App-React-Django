import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { resetState, comment } from "../actions/auth";
import { TextField, Button, LinearProgress } from "@material-ui/core";
import { Rating } from "@material-ui/lab";

const SetComment = ({
  setOpenPopup,
  requestSuccess,
  requestFail,
  resetState,
  id,
  comment,
}) => {
  const [formData, setFormData] = useState({
    item: id,
    star: 5,
    title: "",
    description: "",
  });

  const { item, star, title, description } = formData;
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
    comment(item, star, title, description);
    setRequestSent(true);
  };

  return (
    <div style={{ textAlign: "center" }}>
      {requestSent ? <LinearProgress /> : ""}
      <form onSubmit={(e) => onSubmit(e)}>
        <div style={{ marginTop: 5 }}>
          <Rating name="star" value={star} onChange={(e) => onChange(e)} />
        </div>
        <div style={{ marginTop: 5 }}>
          <TextField
            type="text"
            label="عنوان"
            name="title"
            value={title}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div style={{ marginTop: 5 }}>
          <TextField
            type="text"
            label="نظر"
            name="description"
            value={description}
            multiline
            rows={4}
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
export default connect(mapStateToProps, { resetState, comment })(SetComment);
