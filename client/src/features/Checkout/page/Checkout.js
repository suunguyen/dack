import { Button, Grid, Stack, Typography } from '@mui/material';
import Header from 'components/common/Header';
import Page from 'components/common/Page';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CartTotal from '../../Cart/component/CartTotal';
import InforAddressDelivery from '../component/InforAddressDelivery';
import { cartActions } from '../../Cart/cartSlice';
import {
  cartDiscountSelector,
  cartItemsCountSelector,
  cartItemsSelector,
  cartTotalSelector,
} from '../../Cart/seletors';
import CardProduct from '../../Account/components/CardProduct';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { ADD_ORDER, FETCH_ORDER_PRODUCT } from 'app/saga/auth/actionType';
import { useNavigate } from 'react-router-dom';
import authAPI from 'api/userApi';
import { toast } from 'react-toastify';

function Checkout(props) {
  const cartItems = useSelector(cartItemsSelector);
  const cartTotal = useSelector(cartTotalSelector);
  const cartItemsCount = useSelector(cartItemsCountSelector);
  const cartDiscount = useSelector(cartDiscountSelector);
  const { userData } = useSelector((state) => state.user);
  const { addressDelivery } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCheckout = async () => {
    try {
      if (addressDelivery?.fullName) {
        const data = {
          userId: userData.userId,
          details: cartItems.map((item, index) => ({
            product: item.product._id,
            selected: item.selected,
            total: item.quantity * item.product.salePrice,
            quantity: item.quantity,
          })),
          total_price: cartTotal - cartDiscount,
          payment_status: 0,
          delivery_fee: 30000,
        };
        const res = await authAPI.addOrder(data);
        if (res.success) {
          dispatch(cartActions.clearCart());
          navigate(`/checkout/${res.order._id}`);
          toast.success(res.message);
        }
      } else {
        toast.error('Ch??a c?? ?????a ch??? giao h??ng!!!');
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    dispatch({ type: FETCH_ORDER_PRODUCT, userId: userData.userId });
  }, []);

  return (
    <Page
      title="Ti???n h??nh ?????t h??ng"
      header={<Header headerMobile="onlyTitle" titleMobile="Ti???n h??nh ?????t h??ng" />}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ mb: 3, display: { xs: 'none', md: 'flex' } }}
      ></Stack>
      <Grid container rowSpacing={2} padding={0}>
        <Grid item xs={12} md={12} bgcolor={'white'} paddingLeft={'5px'}>
          <Typography component="h1" variant="h6" padding={'10px'} paddingBottom={'20px'}>
            ?????a ch??? giao h??ng:
          </Typography>
          <InforAddressDelivery />
        </Grid>
        <Grid item xs={12} md={12} bgcolor={'white'} mt={2} padding={0}>
          <Typography component="h1" variant="h6" padding={'10px'}>
            Danh s??ch s???n ph???m
          </Typography>
          {cartItems?.map((item, index) => (
            <CardProduct
              key={index}
              img={item.product.image[0]}
              name={item.product.name}
              attribute={item.selected.value}
              quantity={item.quantity}
              price={item.product.salePrice}
            />
          ))}
        </Grid>
        <Grid item xs={12} md={12}>
          <FormControl fullWidth style={{ backgroundColor: 'white', padding: '10px' }}>
            <FormLabel
              id="demo-radio-buttons-group-label"
              style={{
                backgroundColor: 'white',
                fontWeight: 'bold',
                padding: '10px 0px',
                color: 'black',
                fontSize: '18px',
              }}
            >
              Ch???n ph????ng th???c th??nh to??n
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="COD"
              name="radio-buttons-group"
            >
              <FormControlLabel value="COD" control={<Radio />} label="Thanh to??n khi giao h??ng" />
              <FormControlLabel value="DIFF" control={<Radio />} label="Kh??c" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12}>
          <CartTotal cartTotal={cartTotal} hide={true} discount={cartDiscount} />
        </Grid>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          fullWidth
          disableElevation
          sx={{ mt: 2 }}
          onClick={handleCheckout}
        >
          ?????t h??ng
        </Button>
      </Grid>
    </Page>
  );
}

export default Checkout;
