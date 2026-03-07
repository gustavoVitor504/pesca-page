export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  rating: number;
  reviews: number;
  image: string;
}