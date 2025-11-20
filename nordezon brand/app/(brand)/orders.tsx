import BackgroundContainer from '@/components/common/BackgroundContainer';
import BrandBreadCrums from '@/components/common/BrandBreadCrums';
import OrderList from '@/components/order/OrderList';
import React from 'react';
import { StyleSheet } from 'react-native';

const OrdersScreen = () => {
  return (
    <BackgroundContainer >
      <BrandBreadCrums paddingHorizontal={7} title={'Manage Your Order'}
        subtitle={'Easily update, edit, or browse your collections'}
      ></BrandBreadCrums>
      <OrderList />
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({

});

export default OrdersScreen;
