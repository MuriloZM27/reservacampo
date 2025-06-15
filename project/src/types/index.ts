export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Field {
  id: string;
  name: string;
  type: 'fut11' | 'fut7' | 'futsal';
  neighborhood: string;
  address: string;
  capacity: number;
  hourlyRate: number;
  amenities: string[];
  images: string[];
  operatingHours: {
    start: string;
    end: string;
  };
  rating: number;
  totalReviews: number;
}

export interface Reservation {
  id: string;
  fieldId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalCost: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  field: Field;
}

export interface SearchFilters {
  query: string;
  type: string;
  neighborhood: string;
  date: string;
  minPrice: number;
  maxPrice: number;
}