import { Box, Divider, Typography } from '@mui/material';
import locationAPI from 'api/location/locationApi';
import { FETCH_DELIVERY_ADDRESS_REQUEST } from 'app/saga/auth/actionType';
import { FETCH_PROVINCE } from 'app/saga/location/actionType';
import Page from 'components/common/Page';
import OrderDelivery from 'features/Account/components/OderDelivery';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useStyle from './useStyle';
import authAPI from 'api/userApi';
import LoadingScreen from 'components/common/LoadingScreen';
import Linkaccount from '../components/LinkAccount';
import Header from 'components/common/Header';
import { formatDate } from 'utils';

function InforOder() {
  const classes = useStyle();
  const { province } = useSelector((state) => state.location);
  const { userData } = useSelector((state) => state.user);
  const { addressDelivery } = useSelector((state) => state.user);
  const [district, setDistrict] = useState([]);
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const [detail, setDetail] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    setLoading(true);
    const res = await authAPI.getOrderDetail(orderId);
    setDetail(res.order[0]);
    setLoading(false);
  }, [orderId]);

  var date = new Date(`${detail?.order_time}`);
  console.log(detail?.order_time);

  const locationCity = province.find((value) => value.id == addressDelivery.city)?.name;
  const locationDistrict = useMemo(
    () => district.find((value) => value.id == addressDelivery.district)?.name,
    [district]
  );

  useEffect(() => {
    dispatch({ type: FETCH_DELIVERY_ADDRESS_REQUEST, userId: userData.userId });
    dispatch({ type: FETCH_PROVINCE });
  }, []);

  useEffect(() => {
    locationAPI.district(addressDelivery.city).then((res) => {
      setDistrict(res.data);
    });
  }, [addressDelivery]);

  if (loading) {
    return (
      <Page
        title="Chi ti???t ????n h??ng"
        header={<Header headerMobile="onlyTitle" titleMobile="Chi ti???t ????n h??ng" />}
      >
        <LoadingScreen />
      </Page>
    );
  }

  return (
    <Page
      title="Chi ti???t ????n h??ng"
      header={<Header headerMobile="onlyTitle" titleMobile="Chi ti???t ????n h??ng" />}
    >
      <Box className={classes.mt18}>
        <OrderDelivery
          id={orderId}
          status={detail.order_status}
          deliveryFee={detail.delivery_fee}
          totalPrice={detail.total_price}
          details={detail.details}
        />
      </Box>
      {addressDelivery?.fullName ? (
        <Box className={classes.inforOrder}>
          <Typography>?????a ch??? nh???n h??ng:</Typography>
          <Divider />
          <div>
            <Typography>{addressDelivery.fullName}</Typography>
            <Typography>{addressDelivery.phone}</Typography>
            <Typography>
              {addressDelivery.apartmentNumber}, {addressDelivery.ward}, {locationDistrict},{' '}
              {locationCity}
            </Typography>
          </div>
        </Box>
      ) : (
        <Box className={classes.inforOrder}>
          <Linkaccount
            title="?????a ch??? giao h??ng"
            iconStart={''}
            endButton={'Th??m'}
            href="/address"
          />
        </Box>
      )}

      <Box className={classes.inforOrder}>
        <Typography>Th??ng tin kh??c:</Typography>
        <Divider />
        <div>
          <div>
            <Typography color={'#808080'}>M?? ????n h??ng</Typography>
            <Typography>{orderId}</Typography>
          </div>
          <div>
            <Typography color={'#808080'}>Th???i gian ?????t h??ng:</Typography>
            <Typography>{formatDate(date)}</Typography>
          </div>
          <div>
            <Typography color={'#808080'}>Ph????ng th???c thanh to??n:</Typography>
            <Typography color={'#FF5F2D'}>Thanh to??n khi nh???n h??ng</Typography>
          </div>
        </div>
      </Box>
    </Page>
  );
}

export default InforOder;
