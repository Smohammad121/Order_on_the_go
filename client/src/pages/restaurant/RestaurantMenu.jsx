import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantMenu = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [AvailableCategories, setAvailableCategories] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);

  const [sortFilter, setSortFilter] = useState('popularity');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [typeFilter, settypeFilter] = useState([]);

  useEffect(() => {
    fetchRestaurant();
    fetchCategories();
    fetchItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-categories');
      setAvailableCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchRestaurant = async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-restaurant-details/${userId}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-items`);
      setItems(response.data);
      setVisibleItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCategoryFilter([...categoryFilter, value]);
    } else {
      setCategoryFilter(categoryFilter.filter(size => size !== value));
    }
  };

  const handleTypeCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      settypeFilter([...typeFilter, value]);
    } else {
      settypeFilter(typeFilter.filter(size => size !== value));
    }
  };

  const handleSortFilterChange = (e) => {
    const value = e.target.value;
    setSortFilter(value);
    const sortedItems = [...visibleItems];

    if (value === 'low-price') {
      setVisibleItems(sortedItems.sort((a, b) => a.price - b.price));
    } else if (value === 'high-price') {
      setVisibleItems(sortedItems.sort((a, b) => b.price - a.price));
    } else if (value === 'discount') {
      setVisibleItems(sortedItems.sort((a, b) => b.discount - a.discount));
    } else if (value === 'rating') {
      setVisibleItems(sortedItems.sort((a, b) => b.rating - a.rating));
    }
  };

  useEffect(() => {
    if (categoryFilter.length > 0 && typeFilter.length > 0) {
      setVisibleItems(items.filter(product =>
        categoryFilter.includes(product.menuCategory) &&
        typeFilter.includes(product.category)
      ));
    } else if (typeFilter.length > 0) {
      setVisibleItems(items.filter(product =>
        typeFilter.includes(product.category)
      ));
    } else if (categoryFilter.length > 0) {
      setVisibleItems(items.filter(product =>
        categoryFilter.includes(product.menuCategory)
      ));
    } else {
      setVisibleItems(items);
    }
  }, [categoryFilter, typeFilter, items]);

  // ✅ Don't render until restaurant is loaded
  if (!restaurant) return <div style={{ marginTop: '14vh' }}>Loading restaurant data...</div>;

  return (
    <div className="AllRestaurantsPage" style={{ marginTop: '14vh' }}>
      <div className="restaurants-container">
        <div className="restaurants-filter">
          <h4>Filters</h4>
          <div className="restaurant-filters-body">

            {/* Sort Filter */}
            <div className="filter-sort">
              <h6>Sort By</h6>
              <div className="filter-sort-body sub-filter-body">
                {['popularity', 'low-price', 'high-price', 'discount', 'rating'].map((type, idx) => (
                  <div className="form-check" key={idx}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sort"
                      value={type}
                      id={`sort-${type}`}
                      onChange={handleSortFilterChange}
                    />
                    <label className="form-check-label" htmlFor={`sort-${type}`}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Food Type Filter */}
            <div className="filter-categories">
              <h6>Food Type</h6>
              <div className="filter-categories-body sub-filter-body">
                {['Veg', 'Non Veg', 'Beverages'].map((type, idx) => (
                  <div className="form-check" key={idx}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={type}
                      checked={typeFilter.includes(type)}
                      onChange={handleTypeCheckBox}
                      id={`type-${type}`}
                    />
                    <label className="form-check-label" htmlFor={`type-${type}`}>
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-categories">
              <h6>Categories</h6>
              <div className="filter-categories-body sub-filter-body">
                {AvailableCategories.map((category, idx) => (
                  <div className="form-check" key={idx}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={category}
                      checked={categoryFilter.includes(category)}
                      onChange={handleCategoryCheckBox}
                      id={`cat-${category}`}
                    />
                    <label className="form-check-label" htmlFor={`cat-${category}`}>
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Menu Items Display */}
        <div className="restaurants-body">
          <h3>All Items</h3>
          <div className="restaurants">
            {visibleItems
              .filter(item => item.restaurantId === restaurant._id)
              .map(item => (
                <div className='restaurant-item' key={item._id}>
                  <div className="restaurant">
                    <img src={item.itemImg} alt={item.title} />
                    <div className="restaurant-data">
                      <h6>{item.title}</h6>
                      <p>{item.description?.slice(0, 25) + '...'}</p>
                      <h6>&#8377; {item.price}</h6>
                      <button className='btn btn-outline-primary' onClick={() => navigate(`/update-product/${item._id}`)}>
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            {visibleItems.filter(item => item.restaurantId === restaurant._id).length === 0 &&
              <p>No items found for this restaurant.</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;
