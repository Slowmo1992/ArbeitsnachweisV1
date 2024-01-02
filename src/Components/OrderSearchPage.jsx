// OrderSearchPage.jsx
import React from 'react';
import OrderManagementPage from './OrderManagementPage';

const OrderSearchPage = ({ orders, onSaveOrder, onEditOrder }) => {
  return (
    <div className="OrderSearchPage">
      <OrderManagementPage orders={orders} onSaveOrder={onSaveOrder} onEditOrder={onEditOrder} />
    </div>
  );
}

export default OrderSearchPage;
