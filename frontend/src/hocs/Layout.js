import React, { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
///import AppBreadCrump from "../components/AppBreadCrump";
import Footer from "../components/Footer";
import { connect } from "react-redux";
import { checkAuthenticated, load_user } from "../actions/auth";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const Layout = (props) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        await props.checkAuthenticated();
        await props.load_user();
      } catch (err) {}
    };

    fetchData();
  }, []);
  const [darkState, setDarkState] = useState(
    JSON.parse(localStorage.getItem("darkState"))
  );
  const palletType = darkState ? "dark" : "light";

  const darkTheme = createMuiTheme({
    typography: {
      fontFamily: "Vazir",
    },
    direction: "rtl",
    palette: {
      type: palletType,
      primary: {
        main: "#2196f3",
      },
      secondary: {
        main: "#2979ff",
      },
    },
  });
  const handleThemeChange = () => {
    setDarkState(!darkState);
    localStorage.setItem(
      "darkState",
      (!JSON.parse(localStorage.getItem("darkState"))).toString()
    );
  };

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={darkTheme}>
        <Appbar checked={darkState} onChange={handleThemeChange} />
        {/* <AppBreadCrump /> */}
        <Container>{props.children}</Container>
        <CssBaseline />

        <Footer />
      </ThemeProvider>
    </StylesProvider>
  );
};

export default connect(null, { checkAuthenticated, load_user })(Layout);
