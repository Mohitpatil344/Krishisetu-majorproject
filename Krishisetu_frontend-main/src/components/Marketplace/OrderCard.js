import React from 'react';

const OrderCard = ({ order }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
      <h3 className="text-lg font-semibold">{order.wasteType}</h3>
      <p className="text-gray-500 text-sm">Buyer: {order.buyer}</p>
      <p className="text-gray-700 mt-1">Quantity: {order.quantity} kg</p>
      <p className="text-gray-700">Total Price: ₹{order.totalPrice}</p>
      <p className={`mt-1 font-medium ${order.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
        Status: {order.status}
      </p>
    </div>
  );
};

export default OrderCard;
