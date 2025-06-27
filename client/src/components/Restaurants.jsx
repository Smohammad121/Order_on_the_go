import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/Restaurants.css';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlCategory = queryParams.get('category');
  const selectedFilter = filter || urlCategory;

  useEffect(() => {
    fetchRestaurants();
    fetchCategories();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('http://localhost:6001/fetch-restaurants');
      setRestaurants(res.data);
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:6001/fetch-categories');
      setCategoryOptions(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  // Filter, Search and Sort logic
  const filteredRestaurants = restaurants
    .filter(r => (selectedFilter ? r.menu.includes(selectedFilter) : true))
    .filter(r => r.title.toLowerCase().includes(search.toLowerCase()));

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="restaurants-container">
      <div className="restaurants-filter">
        <h4>Filters</h4>
        <div className="restaurant-filters-body">

          <div className="search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Search by restaurant name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-sort">
            <h6>Sort By</h6>
            <div className="filter-sort-body sub-filter-body">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sort"
                  checked={sortBy === ''}
                  onChange={() => setSortBy('')}
                />
                <label className="form-check-label">Popularity</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sort"
                  checked={sortBy === 'rating'}
                  onChange={() => setSortBy('rating')}
                />
                <label className="form-check-label">Rating</label>
              </div>
            </div>
          </div>

          <div className="filter-categories">
            <h6>Categories</h6>
            <div className="filter-categories-body sub-filter-body">
              {categoryOptions.map(cat => (
                <div className="form-check" key={cat}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`filter-${cat}`}
                    checked={selectedFilter === cat}
                    onChange={() => setFilter(selectedFilter === cat ? '' : cat)}
                  />
                  <label className="form-check-label" htmlFor={`filter-${cat}`}>
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="restaurants-body">
        <h3>All Restaurants</h3>
        <div className="restaurants">
          {sortedRestaurants.map(restaurant => (
            <div className="restaurant-item" key={restaurant._id}>
              <div className="restaurant">
                <img src={restaurant.mainImg} alt={restaurant.title} />
                <div className="restaurant-data">
                  <h6>{restaurant.title}</h6>
                  <p>{restaurant.address}</p>
                  <h5>Rating: <b>{restaurant.rating || 'N/A'}/5</b></h5>
                </div>
              </div>
            </div>
          ))}

          {sortedRestaurants.length === 0 && (
            <p style={{ padding: '1rem' }}>No restaurants found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
