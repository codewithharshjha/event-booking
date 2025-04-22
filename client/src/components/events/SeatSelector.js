import React from 'react';

const SeatSelector = ({ totalSeats, availableSeats, selectedSeats, onSeatSelect }) => {
  // Generate array of seats with their status
  const generateSeats = () => {
    const seatsArray = [];
    const bookedSeats = totalSeats - availableSeats;
    
    for (let i = 1; i <= totalSeats; i++) {
      const seatNumber = `A${i}`;
      let status = 'available';
      
      // Mark seats as booked (first come, first served for this demo)
      if (i <= bookedSeats) {
        status = 'booked';
      }
      
      // Check if the seat is selected
      if (selectedSeats.some(seat => seat.seatNumber === seatNumber)) {
        status = 'selected';
      }
      
      seatsArray.push({ seatNumber, status });
    }
    
    return seatsArray;
  };
  
  const seats = generateSeats();
  
  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') return;
    
    if (seat.status === 'selected') {
      // Deselect the seat
      onSeatSelect(selectedSeats.filter(s => s.seatNumber !== seat.seatNumber));
    } else {
      // Select the seat
      onSeatSelect([...selectedSeats, { seatNumber: seat.seatNumber }]);
    }
  };
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Select Your Seats</h3>
      
      <div className="mb-6 bg-gray-100 p-4 rounded-md text-center">
        <div className="w-full h-2 bg-gray-300 rounded-full mb-8"></div>
        <p className="text-sm text-gray-500 mb-2">STAGE</p>
      </div>
      
      <div className="grid grid-cols-8 gap-2 mb-6">
        {seats.map((seat) => (
          <div
            key={seat.seatNumber}
            className={`
              h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors
              ${seat.status === 'available' ? 'seat-available' : ''}
              ${seat.status === 'selected' ? 'seat-selected' : ''}
              ${seat.status === 'booked' ? 'seat-booked' : ''}
            `}
            onClick={() => handleSeatClick(seat)}
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-success-100 border border-success-200 mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-primary-500 border border-primary-600 mr-2"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-gray-200 border border-gray-300 mr-2"></div>
          <span>Booked</span>
        </div>
      </div>
      
      {selectedSeats.length > 0 && (
        <div className="mt-4 p-3 bg-primary-50 border border-primary-100 rounded-md">
          <h4 className="font-medium text-primary-800 mb-1">Selected Seats</h4>
          <div className="flex flex-wrap gap-1">
            {selectedSeats.map((seat) => (
              <span 
                key={seat.seatNumber} 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {seat.seatNumber}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelector;