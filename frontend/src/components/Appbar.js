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
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import {
  ShoppingCartOutlined,
  Brightness7,
  Brightness4,
  PermIdentityRounded,
  Menu,
  ExpandMore,
  SearchSharp,
} from '@material-ui/icons';
import logo from '../sk.svg';
import { load_menu } from '../actions/shop';
const useStyles = makeStyles((theme) => ({
  center: { flexGrow: 1, textAlign: 'center' },
  rightIcons: { flexGrow: 1 },
  navLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  exit: {
    textDecoration: 'none',
    color: 'inherit',
    marginTop: 10,
    marginRight: 20,
  },
  list: {
    width: 280,
  },
  fullList: {
    width: 'auto',
  },
  searchBox: { marginTop: 5 },
}));

const Appbar = ({
  isAuthenticated,
  logout,
  checked,
  onChange,
  order,
  history,
  category,
  load_menu,
  subcategory,
}) => {
  useEffect(() => {
    load_menu();
  }, []);
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
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawerState(!drawerstate);
  };
  const [expanded, setExpanded] = useState(false);
  const handleExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [search, setSearch] = useState('');
  const onTextChange = (e) => setSearch(e.target.value);

  const onSearch = (e) => {
    e.preventDefault();
    const currentUrlParams = new URLSearchParams();
    currentUrlParams.set('keyword', search);
    if (window.location.pathname === '/') {
      history.push(
        window.location.pathname + '?' + currentUrlParams.toString()
      );
    } else {
      window.location.replace('/?keyword=' + search);
    }
  };
  return (
    <>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <IconButton color="inherit" onClick={toggleDrawer}>
            <Menu />
          </IconButton>
          <div className={classes.center}>
            <Link to="/">
              <img src={logo} style={{ height: 30 }} />
            </Link>
          </div>
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
                  vertical: 'top',
                  horizontal: 'left',
                }}
                badgeContent={
                  order
                    ? order.reduce(
                        (n, { cart_items }) => n + cart_items.length,
                        0
                      )
                    : 0
                }
                color="secondary">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </div>
        <form autoComplete="off" onSubmit={(e) => onSearch(e)}>
          <TextField
            autoComplete="off"
            className={classes.searchBox}
            id="search"
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

      <Drawer anchor={'left'} open={drawerstate} onClose={toggleDrawer}>
        <div className={classes.list}>
          <Toolbar>
            <Link className={classes.navLink} to="/" onClick={toggleDrawer}>
              <Typography variant="h6" color="textPrimary">
                صفحه اصلی
              </Typography>
            </Link>
          </Toolbar>
          {category &&
            category.map((cat) => (
              <Accordion
                expanded={expanded === cat.title}
                onChange={handleExpand(cat.title)}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>{cat.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem>
                      <Link
                        onClick={toggleDrawer}
                        className={classes.navLink}
                        to={`/?page=1&category=${cat.title}`}>
                        <Typography>همه موارد این دسته</Typography>
                      </Link>
                    </ListItem>
                    {cat.sub_category.map((sub) => (
                      <ListItem>
                        <Link
                          onClick={toggleDrawer}
                          className={classes.navLink}
                          to={`/?page=1&subcategory=${sub.title}`}>
                          <Typography>{sub.title}</Typography>
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          {isAuthenticated && authLinks}
        </div>
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  order: state.shop.order,
  category: state.shop.category,
});

export default withRouter(
  connect(mapStateToProps, { logout, load_menu })(Appbar)
);
