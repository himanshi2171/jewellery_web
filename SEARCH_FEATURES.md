# Search Functionality Features

## Overview
The ecommerce app now includes comprehensive search functionality that allows users to find products across all categories and brands.

## Features Implemented

### 1. Global Search Bar
- **Location**: Header component and Home page
- **Features**:
  - Real-time search with debouncing (300ms delay)
  - Search suggestions and autocomplete
  - Recent search history
  - Popular search suggestions
  - Clear search functionality

### 2. Search Context
- **File**: `src/context/SearchContext.tsx`
- **Features**:
  - Global search state management
  - Weighted search algorithm for better relevance
  - Search across multiple data sources (topBrand, bestSelling)
  - Automatic search suggestions generation

### 3. Search Results Page
- **Route**: `/search?q={query}`
- **Features**:
  - Comprehensive search results display
  - Grid and list view modes
  - Advanced filtering options:
    - Price range filter
    - Source filter (All, Top Brands, Best Selling)
  - Sorting options:
    - Relevance
    - Name (A-Z, Z-A)
    - Price (Low to High, High to Low)
  - Responsive design with animations

### 4. Enhanced SearchBar Component
- **File**: `src/components/SearchBar/page.tsx`
- **Features**:
  - Search suggestions dropdown
  - Recent searches with remove functionality
  - Popular search suggestions
  - Loading states with animations
  - Keyboard navigation support
  - Click outside to close

### 5. Search Utilities
- **File**: `src/utils/searchUtils.ts`
- **Features**:
  - Fuzzy search algorithm
  - Weighted search with relevance scoring
  - Search term highlighting
  - Recent search management
  - Debounced search functions

### 6. Search Animations
- **File**: `src/app/globals.css`
- **Features**:
  - Dropdown animations
  - Search highlight animations
  - Loading state animations
  - Hover effects and transitions

## Search Algorithm

### Weighted Search
The search uses a weighted algorithm that prioritizes:
1. **Exact matches** (highest priority)
2. **Starts with query** (high priority)
3. **Contains query** (medium priority)
4. **Word-by-word matching** (lower priority)

### Searchable Fields
- Product name (weight: 10)
- Brand/title (weight: 8)
- Tags (weight: 6)
- Description (weight: 3)

## Data Sources

### Top Brand Products
- Searches through brand-level information
- Searches through individual product data
- Includes product details like size, stock, offers

### Best Selling Products
- Searches through popular products
- Includes basic product information

## User Experience Features

### Search Suggestions
- **Recent Searches**: Shows last 5 searches with remove option
- **Popular Searches**: Generated from product names and brands
- **Real-time Results**: Shows up to 5 results in dropdown

### Search Results
- **Quick Actions**: Click to view product details
- **Source Indicators**: Shows if product is from Top Brands or Best Selling
- **Price and Rating**: Displays key product information
- **Offer Badges**: Highlights special offers and discounts

### Navigation
- **Keyboard Support**: Enter to search, Escape to clear
- **Click Outside**: Closes search dropdown
- **Breadcrumb Navigation**: Easy return to previous pages

## Technical Implementation

### State Management
- Uses React Context for global search state
- Redux integration for cart and wishlist
- Local storage for recent searches

### Performance Optimizations
- Debounced search to prevent excessive API calls
- Memoized search results and suggestions
- Efficient filtering and sorting algorithms

### Responsive Design
- Mobile-friendly search interface
- Adaptive grid/list layouts
- Touch-friendly interaction elements

## Usage Examples

### Basic Search
1. Type in the search bar
2. View real-time suggestions
3. Click on a suggestion or press Enter
4. View comprehensive results page

### Advanced Search
1. Use the search results page
2. Apply filters (price range, source)
3. Sort results by different criteria
4. Switch between grid and list views

### Recent Searches
1. Click on search bar
2. View recent searches
3. Click to repeat search
4. Remove unwanted searches

## Future Enhancements

Potential improvements for the search functionality:
- Search analytics and trending searches
- Voice search capability
- Advanced filters (category, brand, rating)
- Search result pagination
- Search result caching
- A/B testing for search algorithms 