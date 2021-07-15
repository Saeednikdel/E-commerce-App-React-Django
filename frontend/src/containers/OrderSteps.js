import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Card,
} from "@material-ui/core";
import Cart from "../containers/Cart";
import Addresses from "../containers/Addresses";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(2),
  },
}));

function getSteps() {
  return ["سبد خرید", "انتخاب آدرس", "پرداخت"];
}
function ProfileComponent({ step }) {
  switch (step) {
    case 0:
      return <Cart />;
    case 1:
      return <Addresses />;
    case 2:
      return <h1>payment page</h1>;
  }
}
export default function OrderSteps() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <Card variant="outlined">
        <div>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            className={classes.button}
          >
            برگشت
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleNext}
            className={classes.button}
          >
            {activeStep === steps.length - 1 ? "پرداخت" : "ادامه"}
          </Button>
        </div>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel >{label}</StepLabel>
              <StepContent>
                <ProfileComponent step={index} />
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Card>
    </div>
  );
}
