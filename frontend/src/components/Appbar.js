import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  IconButton,
  Drawer,
  List,
  Divider,
  ListItem,
  TextField,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
} from "@material-ui/core";
import React, { useState } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import { load_items } from "../actions/shop";
import {
  ShoppingCartOutlined,
  Brightness7,
  Brightness4,
  PermIdentityRounded,
  Menu,
  ExpandMore,
  SearchSharp,
} from "@material-ui/icons";
import { drawer_items } from "./DrawerItems";
import logo from "../sk.svg";
const useStyles = makeStyles((theme) => ({
  title: {
    marginLeft: 20,
    textDecoration: "none",
    flexGrow: 1,
  },
  rightIcons: { flexGrow: 1 },
  navLink: {
    textDecoration: "none",
    color: "inherit",
    // margin: 5,
  },
  exit: {
    textDecoration: "none",
    color: "inherit",
    marginTop: 10,
    marginRight: 20,
  },
  list: {
    width: 280,
  },
  fullList: {
    width: "auto",
  },
}));

const Appbar = ({
  isAuthenticated,
  logout,
  checked,
  onChange,
  cart,
  load_items,
  history,
}) => {
  const classes = useStyles();
  const authLinks = (
    <Toolbar>
      <Link className={classes.exit} onClick={() => logOut()}>
        <Typography variant="body1">خروج</Typography>
      </Link>
    </Toolbar>
  );
  const logOut = () => {
    logout();
    setDrawerState(!drawerstate);
  };
  const [drawerstate, setDrawerState] = useState(false);

  const toggleDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerState(!drawerstate);
  };
  const [expanded, setExpanded] = useState(false);
  const handleExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [search, setSearch] = useState("");
  const onTextChange = (e) => setSearch(e.target.value);

  const onSearch = (e) => {
    e.preventDefault();
    const currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.delete("category");
    currentUrlParams.delete("subcategory");
    currentUrlParams.set("page", 1);
    currentUrlParams.set("keyword", search);
    if (window.location.pathname === "/") {
      history.push(
        window.location.pathname + "?" + currentUrlParams.toString()
      );
      // load_items(1, search, false, false);
    } else {
      window.location.replace("/?keyword=" + search);
    }
  };
  const list = () => (
    <div className={classes.list}>
      <Toolbar>
        <Link className={classes.title} to="/" onClick={toggleDrawer}>
          <Typography variant="h6" color="textPrimary">
            SAKAR
          </Typography>
        </Link>
      </Toolbar>
      {drawer_items.map((drawer_item) => (
        <Accordion
          expanded={expanded === drawer_item.category}
          onChange={handleExpand(drawer_item.category)}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography>{drawer_item.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>
                <Link
                  onClick={toggleDrawer}
                  className={classes.navLink}
                  to={`/?page=1&category=${drawer_item.title}`}
                >
                  <Typography>همه موارد این دسته</Typography>
                </Link>
              </ListItem>
              {drawer_item.sub.map((sub_item) => (
                <ListItem>
                  <Link
                    onClick={toggleDrawer}
                    className={classes.navLink}
                    to={`/?page=1&subcategory=${sub_item.title}`}
                  >
                    <Typography>{sub_item.title}</Typography>
                  </Link>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
      {isAuthenticated ? authLinks : ""}
    </div>
  );
  return (
    <>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <div className={classes.rightIcons}>
            <IconButton color="inherit" onClick={toggleDrawer}>
              <Menu />
            </IconButton>
          </div>

          <Link className={classes.title} to="/">
            {/* <Typography variant="h5" color="primary">
              SAKAR
            </Typography> */}
            <img src={logo} style={{ height: 30 }} />
          </Link>
          <IconButton color="inherit" onClick={onChange}>
            {checked ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar>
        <div className={classes.rightIcons}>
          <Link className={classes.navLink} exact to="/profile/user-info">
            <IconButton color="inherit">
              <PermIdentityRounded />
            </IconButton>
          </Link>
          <Link className={classes.navLink} exact to="/cart">
            <IconButton color="inherit">
              <Badge
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                badgeContent={cart ? cart.length : 0}
                color="secondary"
              >
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </div>
        <form
          onSubmit={(e) => onSearch(e)}
        >
          <TextField
            style={{ marginTop: 5 }}
            id="search"
            //name="keyword"
            placeholder="جستجو"
            color="secondary"
            variant="outlined"
            value={search}
            onChange={(e) => onTextChange(e)}
            size="small"
            InputProps={{
              endAdornment: (
                <IconButton color="inherit" size="small" type="submit">
                  <SearchSharp />
                </IconButton>
              ),
            }}
          />
        </form>
      </Toolbar>
      <Divider />

      <Drawer
        // BackdropProps={{ invisible: true }}
        anchor={"left"}
        open={drawerstate}
        onClose={toggleDrawer}
      >
        {list()}
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  cart: state.shop.cart,
});

export default withRouter(
  connect(mapStateToProps, { logout, load_items })(Appbar)
);
