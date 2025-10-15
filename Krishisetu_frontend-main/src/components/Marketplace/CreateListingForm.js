import React, { useState } from "react";

const CreateListingForm = ({ onClose, onListingCreated }) => {
  const [wasteType, setWasteType] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("organic");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newListing = {
      wasteType,
      price,
      quantity: `${quantity} kg`,
      location,
      category,
    };
    if (onListingCreated) onListingCreated(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600"
        >
          ✖️
        </button>
        <h3 className="text-xl font-bold mb-4">Create New Listing</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Waste Type"
            value={wasteType}
            onChange={(e) => setWasteType(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          <input
            type="number"
            placeholder="Price per kg"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          <input
            type="number"
            placeholder="Quantity (kg)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="organic">Organic</option>
            <option value="crop">Crop Residue</option>
            <option value="food">Food Waste</option>
          </select>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListingForm;
