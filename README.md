# Uniblox E-commerce Store

This project is an implementation of an e-commerce store with cart functionality, checkout process, and admin features. It's built using Next.js for both frontend and backend, with Prisma and PostgreSQL for database management.

## Features

- Add items to cart
- Checkout functionality
- Coupon code system (10% discount for every nth order)
- Order history page for authenticated users
- Discount code functionality - form to enter code on checkout page, validation on backend
- Admin APIs for generating discount codes and viewing analytics

## Discount Coupons

There are only few discount coupons I've added in the DB for testing

- `tushar` (10% off)
- `offer50` (50% off)
- `HireMe` (100% off)

## Tech Stack

- Next.js 14.2.13
- React 18
- Prisma with PostgreSQL
- NextAuth.js for authentication
- Framer Motion for animations
- Tailwind CSS for styling

## API Endpoints

### Cart

- `POST /api/cart/add`: Add item to cart
- `POST /api/cart/remove`: Remove item from cart
- `GET /api/cart/get`: Get cart items

### Checkout

- `POST /api/checkout`: Process checkout and apply coupon if valid

### Coupon

- `POST /api/coupon`: Validate and apply coupon code

### Admin

- `GET /api/admin/analytics`: Get store analytics
- `POST /api/admin/coupon/create`: Create new coupon code

### Orders

- `GET /api/orders`: Get user's order history

## Frontend Pages

- `/`: Home page with product listing
- `/product/[id]`: Individual product page
- `/checkout`: Checkout page
- `/orders`: Order history page

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your PostgreSQL database
4. Configure your `.env` file with database credentials
5. Run Prisma migrations: `npx prisma migrate dev`
6. Start the development server: `npm run dev`

## Additional Notes

- The project uses an actual database (PostgreSQL) instead of an in-memory store for data persistence.
- Authentication is implemented using NextAuth.js.
- The frontend is built with Next.JS and uses Framer Motion for animations.
- Tailwind CSS is used for styling, providing a responsive and modern UI.

## Stretch Goals Achieved

- Fully functional UI showcasing all features
- Backend implementation with Next.js API routes
- Database integration with Prisma and PostgreSQL
- User authentication

## Future Improvements

- Implement unit tests
- Add more comprehensive error handling
- Enhance admin dashboard with more features
