This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Search Functionality

The application includes a robust search system that allows users to find products quickly and efficiently:

### Features

- **Auto-suggestions**: As users type, the search bar displays relevant product suggestions in real-time
- **Debounced search**: Optimizes API calls to reduce server load and improve performance
- **Keyboard navigation**: Users can navigate through search results using arrow keys
- **Filtering options**: The search results page includes filters for categories, brands, price ranges, and more
- **Sorting**: Products can be sorted by popularity, price, rating, or newest
- **Pagination**: Handles large result sets with efficient pagination
- **Mobile-responsive**: Fully functional on both desktop and mobile devices

### Implementation

The search functionality consists of:

- `SearchBar.tsx`: A reusable component for the main search input with auto-suggestions
- `ProductSearch.tsx`: The main search results page component with filtering and sorting
- `/app/search/page.tsx`: The Next.js page that renders the search results

The search integrates with the backend API via the `productsApi.searchProducts()` method.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
