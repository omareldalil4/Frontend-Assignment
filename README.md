# Frontend Assignment

This project implements a property filtering application with SVG polygon filtering based on property type, area, and price ranges.

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/omareldalil4/Frontend-Assignment.git
   cd frontend-assignment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Features

- Filter properties by type (Commercial, Administrative, Clinical)
- Filter by area range (0-300 sq.m)
- Filter by price range (0-30M EGP)
- Display property details on hover

## Implementation Details

- SVG polygon filtering is implemented using the DOM API as required
- The UI closely matches the provided design examples
- Responsive design that works on different screen sizes

## Project Structure

```
frontend-assignment/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── assets/
│   │   ├── propertyData.js
│   │   └── polygonData.js
│   ├── components/
│   │   ├── PropertyFiltering.js
│   │   └── PropertyFiltering.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```
