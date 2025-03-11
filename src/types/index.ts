export interface Fruit {
  id: string;
  name: string;
  image: string;
}

export interface BasketState {
  fruits: Fruit[];
  count: number;
} 