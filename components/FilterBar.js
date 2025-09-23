import React from 'react';
import './FilterBar.css';

function FilterBar({ categories, styles, selectedCategory, selectedStyle, onCategoryChange, onStyleChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="category-filter">类别:</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="filter-select"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="style-filter">风格:</label>
        <select
          id="style-filter"
          value={selectedStyle}
          onChange={(e) => onStyleChange(e.target.value)}
          className="filter-select"
        >
          {styles.map(style => (
            <option key={style.id} value={style.id}>
              {style.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;