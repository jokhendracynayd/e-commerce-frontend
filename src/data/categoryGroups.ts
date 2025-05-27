import { CategoryGroup } from '@/components/product/CategoryGroups';

// This mock data would normally come from an API
export const categoryGroupsData: CategoryGroup[] = [
  {
    id: 1,
    title: "Elevate your Electronics",
    categories: [
      { id: 101, name: "Headphones", image: "https://picsum.photos/id/367/300/300" },
      { id: 102, name: "Tablets", image: "https://picsum.photos/id/365/300/300" },
      { id: 103, name: "Gaming", image: "https://picsum.photos/id/96/300/300" },
      { id: 104, name: "Speakers", image: "https://picsum.photos/id/93/300/300" }
    ],
    ctaText: "Discover more",
    ctaLink: "/category/electronics"
  },
  {
    id: 2,
    title: "Have more fun with family",
    categories: [
      { id: 201, name: "Outdoor Play Sets", image: "https://picsum.photos/id/131/300/300" },
      { id: 202, name: "Learning Toys", image: "https://picsum.photos/id/237/300/300" },
      { id: 203, name: "Action Figures", image: "https://picsum.photos/id/180/300/300" },
      { id: 204, name: "Pretend Play Toys", image: "https://picsum.photos/id/200/300/300" }
    ],
    ctaText: "See more",
    ctaLink: "/category/toys"
  },
  {
    id: 3,
    title: "Gaming merchandise",
    categories: [
      { id: 301, name: "Apparel", image: "https://picsum.photos/id/325/300/300" },
      { id: 302, name: "Hats", image: "https://picsum.photos/id/319/300/300" },
      { id: 303, name: "Action figures", image: "https://picsum.photos/id/338/300/300" },
      { id: 304, name: "Mugs", image: "https://picsum.photos/id/30/300/300" }
    ],
    ctaText: "See more",
    ctaLink: "/category/gaming-merchandise"
  },
  {
    id: 4,
    title: "Gear up to get fit",
    categories: [
      { id: 401, name: "Clothing", image: "https://picsum.photos/id/103/300/300" },
      { id: 402, name: "Trackers", image: "https://picsum.photos/id/111/300/300" },
      { id: 403, name: "Equipment", image: "https://picsum.photos/id/176/300/300" },
      { id: 404, name: "Deals", image: "https://picsum.photos/id/184/300/300" }
    ],
    ctaText: "Discover more",
    ctaLink: "/category/fitness"
  }
];

export default categoryGroupsData; 