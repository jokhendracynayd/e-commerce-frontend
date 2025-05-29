import { CategoryGroup } from '@/components/product/CategoryGroups';

// This mock data would normally come from an API
export const categoryGroupsData: CategoryGroup[] = [
  {
    id: 1,
    title: "Elevate your Electronics",
    categories: [
      { id: 101, name: "Headphones", image: "https://i.pinimg.com/736x/43/15/ae/4315ae69df9daa2550203db798b0d77f.jpg" },
      { id: 102, name: "Tablets", image: "https://i.pinimg.com/736x/3d/37/d7/3d37d7aa9787256dda0591dc2c121001.jpg" },
      { id: 103, name: "Gaming", image: "https://i.pinimg.com/736x/39/15/e4/3915e4b87e3ed23b1f8670609b99710a.jpg" },
      { id: 104, name: "Speakers", image: "https://i.pinimg.com/736x/90/3f/66/903f66db561c426d8f8e9c551ece7cee.jpg" }
    ],
    ctaText: "Discover more",
    ctaLink: "/category/electronics"
  },
  {
    id: 2,
    title: "Have more fun with family",
    categories: [
      { id: 201, name: "Outdoor Play Sets", image: "https://i.pinimg.com/736x/ec/30/90/ec3090a071542a6ffa54237e30fcb220.jpg" },
      { id: 202, name: "Learning Toys", image: "https://i.pinimg.com/736x/b5/1c/88/b51c880227de78a3131e52aa5ff7d581.jpg" },
      { id: 203, name: "Action Figures", image: "https://i.pinimg.com/736x/76/3f/44/763f4454ee41c086f9cfd296400ab387.jpg" },
      { id: 204, name: "Pretend Play Toys", image: "https://i.pinimg.com/736x/c7/12/b7/c712b7f6ea05c2dc48ea7665f0122be0.jpg" }
    ],
    ctaText: "See more",
    ctaLink: "/category/toys"
  },
  {
    id: 3,
    title: "Gaming merchandise",
    categories: [
      { id: 301, name: "Apparel", image: "https://i.pinimg.com/736x/94/1d/9f/941d9fee290f2e088558f909aa84268a.jpg" },
      { id: 302, name: "Hats", image: "https://i.pinimg.com/736x/e0/bd/2f/e0bd2fb7e82af3a51ad06bc9831f925b.jpg" },
      { id: 303, name: "Clothing", image: "https://i.pinimg.com/736x/24/a5/c2/24a5c2fe42201494dfe5cf71280b7845.jpg" },
      { id: 304, name: "Mugs", image: "https://i.pinimg.com/736x/97/38/4e/97384ecd78fbf41c73d3ce3112ee05db.jpg" }
    ],
    ctaText: "See more",
    ctaLink: "/category/gaming-merchandise"
  },
  {
    id: 4,
    title: "Gear up to get fit",
    categories: [
      { id: 401, name: "Trackers", image: "https://i.pinimg.com/736x/37/a8/ae/37a8ae2095512429d5d0ffa5d8675378.jpg" },
      { id: 402, name: "Equipment", image: "https://i.pinimg.com/736x/c9/b3/f1/c9b3f1814dfbc03e9964b429a5e39966.jpg" },
      { id: 403, name: "Deals", image: "https://i.pinimg.com/736x/06/9d/87/069d878908ddacd172e0a8976e1fedac.jpg" },
      { id: 404, name: "Gaming", image: "https://i.pinimg.com/736x/39/15/e4/3915e4b87e3ed23b1f8670609b99710a.jpg" }
    ],
    ctaText: "Discover more",
    ctaLink: "/category/fitness"
  }
];

export default categoryGroupsData; 