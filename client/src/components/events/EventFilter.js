import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EventFilter = ({ initialCategory = '', initialSearch = '' }) => {
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Conference', label: 'Conference' },
    { value: 'Concert', label: 'Concert' },
    { value: 'Exhibition', label: 'Exhibition' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Other', label: 'Other' },
  ];

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
   
    // Navigate with query params
    navigate(`${location.pathname}?${params.toString()}`);
  };
  
  const handleClear = () => {
    setCategory('');
    setSearch('');
    navigate(location.pathname);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <label htmlFor="search" className="form-label">Search</label>
            <input
              type="text"
              id="search"
              className="input-field"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="md:col-span-5">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex items-end">
            <div className="grid grid-cols-2 gap-2 w-full">
              <button type="submit" className="btn-primary h-10">
                Filter
              </button>
              <button 
                type="button" 
                className="btn-outline h-10" 
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventFilter;