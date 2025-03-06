# Instagram Shop Frontend

This frontend application allows you to:

1. Enter an Instagram URL to scrape posts
2. View a minimalist shop landing page with featured products from the scraped posts
3. Browse all products in a shop page

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Usage

1. Make sure the backend server is running at http://localhost:8000
2. Enter an Instagram URL in the form on the landing page
3. After scraping, you'll see a minimalist shop landing page with featured products
4. Click the "Shop" button to view all products

## Project Structure

- `src/pages/Index.tsx`: Landing page with Instagram URL input form and shop landing page
- `src/pages/Shop.tsx`: Shop page displaying all scraped products
- `src/pages/ProductDetail.tsx`: Product detail page
- `src/components/ProductCard.tsx`: Component for displaying product cards
- `src/components/ProductGrid.tsx`: Component for displaying a grid of products

## Notes

- The application uses the cart-design-sorcery template for the shop layout
- Scraped Instagram posts are converted to product format for display
- The application stores scraped data in sessionStorage for persistence 