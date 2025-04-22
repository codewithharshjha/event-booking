import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  const { _id, title, imageUrl, date, location, ticketPrice, category, availableSeats } = event;

  // Format the date
  const formattedDate = format(new Date(date), 'MMM dd, yyyy');

  return (
    <Link to={`/events/${_id}`} className="block group">
      <div className="event-card h-full flex flex-col">
        <div className="relative h-48 w-full overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center">
              <span className="text-white text-xl font-bold">{title.substring(0, 1)}</span>
            </div>
          )}
          <div className="absolute top-0 right-0 m-2 bg-white px-2 py-1 rounded-full text-xs font-medium text-primary-600">
            {category}
          </div>
        </div>
        <div className="flex flex-col flex-1 p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <div className="text-sm text-gray-500 mb-2">
            <div className="flex items-center mb-1">
              <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate}
            </div>
            <div className="flex items-center">
              <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </div>
          </div>
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-200">
            <div className="font-medium text-primary-600">${ticketPrice}</div>
            <div className="text-sm text-gray-500">
              {availableSeats > 0 ? (
                <span className="text-success-600">
                  {availableSeats} {availableSeats === 1 ? 'seat' : 'seats'} left
                </span>
              ) : (
                <span className="text-error-600">Sold out</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;