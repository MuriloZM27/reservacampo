import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Field, Reservation, SearchFilters } from '../types';

interface AppContextType {
  user: User | null;
  fields: Field[];
  reservations: Reservation[];
  searchFilters: SearchFilters;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
  makeReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'field'>) => Promise<boolean>;
  cancelReservation: (reservationId: string) => Promise<boolean>;
  getFieldById: (id: string) => Field | undefined;
  addField: (field: Omit<Field, 'id'>) => Promise<boolean>;
  updateField: (id: string, field: Partial<Field>) => Promise<boolean>;
  deleteField: (id: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data with real Maringá fields
const mockFields: Field[] = [
  {
    id: '1',
    name: 'Estádio Regional Willie Davids',
    type: 'fut11',
    neighborhood: 'Vila Olímpica',
    address: 'Complexo Esportivo Jaime Canet Júnior (Vila Olímpica), Avenida Prudente de Moraes – Maringá, PR',
    capacity: 22,
    hourlyRate: 150,
    amenities: ['Vestiário', 'Iluminação', 'Estacionamento', 'Bebedouro', 'Arquibancada', 'Gramado Natural'],
    images: ['https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg'],
    operatingHours: { start: '06:00', end: '22:00' },
    rating: 4.9,
    totalReviews: 156
  },
  {
    id: '2',
    name: 'Ginásio Chico Neto (Centro Esportivo Francisco Bueno Neto)',
    type: 'futsal',
    neighborhood: 'Vila Olímpica',
    address: 'Avenida Duque de Caxias, 1368 – Vila Olímpica, Maringá, PR',
    capacity: 10,
    hourlyRate: 80,
    amenities: ['Vestiário', 'Iluminação', 'Bebedouro', 'Quadra Coberta', 'Som Ambiente'],
    images: ['https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg'],
    operatingHours: { start: '07:00', end: '22:00' },
    rating: 4.7,
    totalReviews: 89
  },
  {
    id: '3',
    name: 'Centro Esportivo Profª Edith Dias de Carvalho (Borba Gato)',
    type: 'futsal',
    neighborhood: 'Borba Gato',
    address: 'Rua das Sibipirunas, s/n – Borba Gato, Maringá, PR',
    capacity: 10,
    hourlyRate: 70,
    amenities: ['Vestiário', 'Iluminação', 'Bebedouro', 'Quadra Coberta'],
    images: ['https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg'],
    operatingHours: { start: '06:00', end: '21:00' },
    rating: 4.5,
    totalReviews: 67
  },
  {
    id: '4',
    name: 'Fut7 Maringá (Thiago El Ghoz de Lara LTDA)',
    type: 'fut7',
    neighborhood: 'Zona 08',
    address: 'Avenida Doutor Gastão Vidigal, 1313 – Zona 08, Maringá, PR',
    capacity: 14,
    hourlyRate: 90,
    amenities: ['Vestiário', 'Iluminação', 'Estacionamento', 'Bebedouro', 'Grama Sintética'],
    images: ['https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg'],
    operatingHours: { start: '06:00', end: '23:00' },
    rating: 4.8,
    totalReviews: 124
  },
  {
    id: '5',
    name: 'Nova Arena Fut7 LTDA',
    type: 'fut7',
    neighborhood: 'Parque Avenida',
    address: 'Rua Allan Kardec, 1741 – Parque Avenida, Maringá, PR',
    capacity: 14,
    hourlyRate: 85,
    amenities: ['Vestiário', 'Iluminação', 'Estacionamento', 'Bebedouro', 'Grama Sintética'],
    images: ['https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg'],
    operatingHours: { start: '07:00', end: '22:00' },
    rating: 4.6,
    totalReviews: 98
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [fields, setFields] = useState<Field[]>(mockFields);
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const stored = localStorage.getItem("reservations");
    return stored ? JSON.parse(stored) : [];
  });
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    type: '',
    neighborhood: '',
    date: '',
    minPrice: 0,
    maxPrice: 200
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  }, [reservations]);


  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    // Mock login logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      name: email === 'admin@zaggo.com' ? 'Administrador ZAGGO' : 'João Silva',
      email,
      phone: '(44) 99999-9999',
      isAdmin: email === 'admin@zaggo.com',
      createdAt: new Date().toISOString()
    };
    
    setUser(mockUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setReservations([]);
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const updateSearchFilters = (filters: Partial<SearchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...filters }));
  };

  const makeReservation = async (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'field'>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const field = fields.find(f => f.id === reservationData.fieldId);
    if (!field) return false;
    
    const newReservation: Reservation = {
      ...reservationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      field
    };
    
    setReservations(prev => [...prev, newReservation]);
    setIsLoading(false);
    return true;
  };

  const cancelReservation = async (reservationId: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setReservations(prev => 
      prev.map(r => 
        r.id === reservationId 
          ? { ...r, status: 'cancelled' as const }
          : r
      )
    );
    
    setIsLoading(false);
    return true;
  };

  const getFieldById = (id: string): Field | undefined => {
    return fields.find(field => field.id === id);
  };

  const addField = async (fieldData: Omit<Field, 'id'>): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newField: Field = {
      ...fieldData,
      id: Date.now().toString(),
      rating: 0,
      totalReviews: 0
    };
    
    setFields(prev => [...prev, newField]);
    setIsLoading(false);
    return true;
  };

  const updateField = async (id: string, fieldData: Partial<Field>): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setFields(prev => 
      prev.map(field => 
        field.id === id 
          ? { ...field, ...fieldData }
          : field
      )
    );
    
    setIsLoading(false);
    return true;
  };

  const deleteField = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setFields(prev => prev.filter(field => field.id !== id));
    setIsLoading(false);
    return true;
  };

  return (
    <AppContext.Provider value={{
      user,
      fields,
      reservations,
      searchFilters,
      isLoading,
      login,
      logout,
      register,
      updateSearchFilters,
      makeReservation,
      cancelReservation,
      getFieldById,
      addField,
      updateField,
      deleteField
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}