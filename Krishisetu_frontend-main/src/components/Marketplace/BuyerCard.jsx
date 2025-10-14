import React from 'react';

const BuyerCard = ({ buyer }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
      <h3 className="text-lg font-semibold">{buyer.name}</h3>
      <p className="text-gray-500 text-sm">Location: {buyer.location}</p>
      <p className="text-gray-700 mt-1">Rating: {buyer.rating} ⭐</p>
    </div>
  );
};

export default BuyerCard;
