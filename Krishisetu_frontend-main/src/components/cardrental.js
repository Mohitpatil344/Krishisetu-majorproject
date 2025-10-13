// src/components/cardrental.js
import React from "react";
import { Calendar, IndianRupee, MapPin, Tag, Edit } from "lucide-react";

const CardRental = ({ rental, onRentClick, onEditClick, canEdit = false }) => {
  return (
    <div className="group relative w-80 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col">
      
      {/* Image Section */}
      <div className="relative">
        <img
          src={rental.image}
          alt={rental.name}
          className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1581093588401-22b8d2f94d1f";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

        <div className={`absolute top-3 left-3 ${
          rental.availability === "Available" ? "bg-green-600" : "bg-red-600"
        } text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md`}>
          {rental.availability || "Available"}
        </div>

        {/* Edit Button - Only show if user can edit */}
        {canEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditClick(rental);
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 group/edit"
            title="Edit Equipment"
          >
            <Edit className="w-4 h-4 text-gray-700 group-hover/edit:text-green-600 transition-colors" />
          </button>
        )}
      </div>

      {/* Info Section */}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
          {rental.name}
        </h2>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
          {rental.details || "No description available"}
        </p>

        {rental.location && (
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
            <MapPin className="w-4 h-4 text-green-600" />
            <span>{rental.location}</span>
          </div>
        )}

        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
          {rental.brand && (
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <Tag className="w-4 h-4 text-green-600" />
              <span>{rental.brand}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-gray-800 font-semibold">
            <IndianRupee className="w-4 h-4 text-green-600" />
            <span>{rental.price}</span>
            <span className="text-xs text-gray-500">/day</span>
          </div>
        </div>

        {/* Lease Duration Display */}
        <div className="flex items-center gap-2 text-gray-700 text-sm mb-4 bg-gray-50 p-3 rounded-lg">
          <Calendar className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="font-medium">
            {rental.leaseDuration || "Not specified"}
          </span>
        </div>

        {/* Date Range if available */}
        {rental.availableFrom && rental.availableTo && (
          <div className="text-xs text-gray-500 mb-4">
            Available: {new Date(rental.availableFrom).toLocaleDateString()} - {new Date(rental.availableTo).toLocaleDateString()}
          </div>
        )}

        {/* Business Info */}
        {rental.businessName && (
          <div className="text-xs text-gray-500 mb-4">
            Listed by: {rental.businessName}
          </div>
        )}

        {/* Rent Button */}
        <button
          onClick={() => onRentClick(rental)}
          className="mt-auto w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2.5 px-4 rounded-xl font-medium hover:from-green-700 hover:to-emerald-600 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Rent Now
        </button>
      </div>

      {/* Hover Gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 blur-xl opacity-15"></div>
      </div>
    </div>
  );
};

export default CardRental;  