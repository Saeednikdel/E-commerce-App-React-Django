import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { load_address, remove_address } from '../actions/auth';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  ButtonGroup,
  CircularProgress,
  makeStyles,
  Button,
  Typography,
} from '@material-ui/core';
import Popup from '../components/Popup';
import SetAddress from '../forms/SetAddress';
import { DeleteOutline, EditRounded } from '@material-ui/icons';
const useStyles = makeStyles((theme) => ({
  pageContainer: {
    margin: `${theme.spacing(2)}px`,
  },
  btn: {
    marginBottom: `${theme.spacing(2)}px`,
  },
  noItem: { textAlign: 'center', marginTop: 80 },
}));

const Addresses = ({ addresses, load_address, remove_address }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        await load_address();
      } catch (err) {}
    };
    fetchData();
  }, []);
  const classes = useStyles();
  const [openPopup, setOpenPopup] = useState(false);
  const [selected, setSelected] = useState();
  const [formData, setFormData] = useState({
    id: '',
    address: '',
    name: '',
    zip_code: '',
    phone: '',
  });
  const handleSelect = (id) => {
    setSelected(id);
    // console.log(id);
  };
  const handleDialog = (index) => {
    if (index === 'create') {
      setFormData({
        id: 0,
        address: '',
        name: '',
        zip_code: '',
        phone: '',
      });
    } else {
      setFormData({
        id: addresses[index].id,
        address: addresses[index].address,
        name: addresses[index].name,
        zip_code: addresses[index].zip_code,
        phone: addresses[index].phone,
      });
    }
    setOpenPopup(true);
  };
  const { id, name, address, zip_code, phone } = formData;

  return addresses ? (
    <div className={classes.pageContainer}>
      <Button
        className={classes.btn}
        color="secondary"
        variant="outlined"
        onClick={() => handleDialog('create')}>
        آدرس جدید
      </Button>
      <Grid container spacing={2}>
        {addresses.map((address, index) => (
          <Grid item xs={12} sm={6} md={4}>
            <div
              onClick={() => handleSelect(address.id)}
              style={{
                border: `1px solid ${
                  address.id === selected ? '#2979ff' : 'rgba(0, 0, 0, 0.12)'
                }`,
                borderRadius: 4,
              }}>
              <CardContent>
                <Typography>
                  آدرس : {address.address.substring(0, 20)}...
                </Typography>
                <Typography>نام : {address.name}</Typography>
                <Typography>کد پستی : {address.zip_code}</Typography>
                <Typography>تلفن : {address.phone}</Typography>
              </CardContent>
              <CardActions>
                <ButtonGroup size="small" color="secondary">
                  <Button onClick={() => handleDialog(index)}>
                    <EditRounded />
                  </Button>
                  <Button onClick={() => remove_address(address.id)}>
                    <DeleteOutline />
                  </Button>
                </ButtonGroup>
              </CardActions>
            </div>
          </Grid>
        ))}
      </Grid>
      <Popup
        title={'آدرس جدید'}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}>
        <SetAddress
          pid={id}
          paddress={address}
          pname={name}
          pzip_code={zip_code}
          pphone={phone}
          setOpenPopup={setOpenPopup}
        />
      </Popup>
      {addresses.length < 1 && (
        <div className={classes.noItem}>
          <Typography variant="h6">لیست آدرس ها خالی است.</Typography>
        </div>
      )}
    </div>
  ) : (
    <CircularProgress color="secondary" />
  );
};
const mapStateToProps = (state) => ({
  addresses: state.auth.address,
});
export default connect(mapStateToProps, { load_address, remove_address })(
  Addresses
);
