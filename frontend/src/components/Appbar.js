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
  ListItemText,
  Badge,
} from "@material-ui/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import {
  ShoppingCart,
  Brightness7,
  Brightness4,
  AccountCircle,
  Menu,
  ExpandMore,
  SearchSharp,
} from "@material-ui/icons";
import { drawer_items } from "./DrawerItems";
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
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
}));

const Appbar = ({ isAuthenticated, logout, checked, onChange, cart }) => {
  const classes = useStyles();
  const authLinks = (
    <Link className={classes.navLink} onClick={logout}>
      <Typography variant="button">Logout</Typography>
    </Link>
  );
  const [drawerstate, setDrawerState] = useState({ open: false });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerState({ ...drawerstate, [anchor]: open });
  };
  const [expanded, setExpanded] = useState(false);

  const handleExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const list = (anchor) => (
    <div
      className={classes.list}
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      <Toolbar>
        <Link
          className={classes.title}
          to="/"
          onClick={toggleDrawer(anchor, false)}
        >
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
              {drawer_item.sub.map((sub_item) => (
                <ListItem
                  button
                  key={sub_item.subcategory}
                  onClick={toggleDrawer(anchor, false)}
                >
                  <ListItemText
                    primary={sub_item.title}
                    style={{ textAlign: "right" }}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
  return (
    <>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <div className={classes.rightIcons}>
            <IconButton color="inherit" onClick={toggleDrawer("open", true)}>
              <Menu />
            </IconButton>

            {isAuthenticated ? authLinks : ""}
          </div>

          <Link className={classes.title} to="/">
            <Typography variant="h5" color="primary">
              SAKAR
            </Typography>
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
              <AccountCircle />
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
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Link>
        </div>
        <form noValidate autoComplete="off">
          <TextField
            style={{ marginTop: 5, width: "14rem" }}
            id="search"
            label="جستجو"
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <IconButton color="inherit" size="small">
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
        open={drawerstate["open"]}
        onClose={toggleDrawer("open", false)}
      >
        {list("open")}
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  cart: state.shop.cart,
});

export default connect(mapStateToProps, { logout })(Appbar);
