import React, { useState, useEffect, useRef } from 'react';
import { propertyData } from '../assets/propertyData';
import { polygonData } from '../assets/polygonData';
import './PropertyFiltering.css';

const PropertyFiltering = () => {
    const [filters, setFilters] = useState({
    types: {
      Commercial: true,
      Administrative: true,
      Clinical: true
    },
    area: {
      min: 0,
      max: 300
    },
    price: {
      min: 0,
      max: 30000000
    }
  });
  
  const [hoveredUnit, setHoveredUnit] = useState(null);
  
  const [visibleUnits, setVisibleUnits] = useState([]);
  
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const filteredUnits = propertyData.filter(unit => {
      if (!filters.types[unit.type]) return false;
      
      if (unit.area < filters.area.min || unit.area > filters.area.max) return false;
      
      if (unit.price < filters.price.min || unit.price > filters.price.max) return false;
      
      return true;
    }).map(unit => unit.id);
    
    setVisibleUnits(filteredUnits);
    
    const polygons = svgRef.current.querySelectorAll('.property-polygon');
    polygons.forEach(polygon => {
      const unitId = parseInt(polygon.getAttribute('data-id'));
      polygon.style.opacity = filteredUnits.includes(unitId) ? '1' : '0.2';
      polygon.style.pointerEvents = filteredUnits.includes(unitId) ? 'auto' : 'none';
    });
    
  }, [filters]);
  
  const handleTypeChange = (type) => {
    setFilters(prev => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: !prev.types[type]
      }
    }));
  };
  
  const handleRangeChange = (category, boundary, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [boundary]: value
      }
    }));
  };
  
  const handlePolygonHover = (unitId) => {
    const unit = propertyData.find(u => u.id === unitId);
    if (unit) setHoveredUnit(unit);
  };
  
  const handlePolygonLeave = () => {
    setHoveredUnit(null);
  };
  
  const formatPrice = (price) => {
    if (price === 0) return "0.0";
    return (price / 1000000).toFixed(1);
  };

  return (
    <div className="property-filter-container">

      <div className="filter-panel">

        <div className="filter-section">
          <div className="filter-header">
            <span className="header-label">Type</span>
            <span className="header-value">Availability</span>
          </div>
          
          <button
            className={`type-button commercial ${filters.types.Commercial ? 'active' : ''}`}
            onClick={() => handleTypeChange('Commercial')}
          >
            Commercial
          </button>
          
          <button
            className={`type-button administrative ${filters.types.Administrative ? 'active' : ''}`}
            onClick={() => handleTypeChange('Administrative')}
          >
            Administrative
          </button>
          
          <button
            className={`type-button clinical ${filters.types.Clinical ? 'active' : ''}`}
            onClick={() => handleTypeChange('Clinical')}
          >
            Clinical
          </button>
        </div>
        
        <div className="filter-section">
          <div className="filter-header">
            <span className="header-label">Area</span>
            <span className="header-value">
              {filters.area.min}.0 - {filters.area.max}.0 Sq.m
            </span>
          </div>
          
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="300"
              value={filters.area.min}
              onChange={(e) => handleRangeChange('area', 'min', parseInt(e.target.value))}
              className="range-slider"
            />
            <input
              type="range"
              min="0"
              max="300"
              value={filters.area.max}
              onChange={(e) => handleRangeChange('area', 'max', parseInt(e.target.value))}
              className="range-slider"
            />
          </div>
        </div>
        
        <div className="filter-section">
          <div className="filter-header">
            <span className="header-label">Price</span>
            <span className="header-value">
              LE {formatPrice(filters.price.min)}M - {formatPrice(filters.price.max)}M
            </span>
          </div>
          
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="30000000"
              step="1000000"
              value={filters.price.min}
              onChange={(e) => handleRangeChange('price', 'min', parseInt(e.target.value))}
              className="range-slider"
            />
            <input
              type="range"
              min="0"
              max="30000000"
              step="1000000"
              value={filters.price.max}
              onChange={(e) => handleRangeChange('price', 'max', parseInt(e.target.value))}
              className="range-slider"
            />
          </div>
        </div>
      </div>
      
      <div className="floor-plan-container">
        <div className="floor-plan-wrapper">

          <button className="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          

          <button className="view-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
          
          <div className="svg-container">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 400 350" 
              className="floor-plan-svg"
              ref={svgRef}
            >

              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0e0e0" strokeWidth="0.5"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
              

              {polygonData.map(polygon => (
                <polygon
                  key={polygon.id}
                  points={polygon.points}
                  fill={polygon.fill}
                  stroke="#666"
                  strokeWidth="1"
                  className="property-polygon"
                  data-id={polygon.id}
                  data-type={polygon.type}
                  onMouseEnter={() => handlePolygonHover(polygon.id)}
                  onMouseLeave={handlePolygonLeave}
                />
              ))}
            </svg>
          </div>
          

          {hoveredUnit && (
            <div className="unit-details-popup">
              <div className="unit-details-content">
                <div className="unit-header">
                  <h3 className="unit-title">Unit {hoveredUnit.id}</h3>
                  <span className={`unit-status ${hoveredUnit.status.toLowerCase()}`}>
                    {hoveredUnit.status}
                  </span>
                </div>
                
                <div className="unit-info">
                  <div className="info-row">
                    <span className="info-label">Unit Type</span>
                    <span className="info-value">{hoveredUnit.type}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Total Area</span>
                    <span className="info-value">{hoveredUnit.area} M²</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Price</span>
                    <span className="info-value">
                      {hoveredUnit.price > 0 ? `${formatPrice(hoveredUnit.price)}M EGP` : '0 EGP'}
                    </span>
                  </div>
                </div>
              </div>
              
              <button className="callback-button">
                Callback
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyFiltering;