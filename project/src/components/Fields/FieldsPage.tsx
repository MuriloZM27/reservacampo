import React, { useState, useMemo } from 'react';
import { MapPin, Clock, Star, Users, Filter, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Field } from '../../types';

interface FieldsPageProps {
  onFieldSelect: (field: Field) => void;
}

export function FieldsPage({ onFieldSelect }: FieldsPageProps) {
  const { fields, searchFilters, updateSearchFilters } = useApp();
  const [showFilters, setShowFilters] = useState(false);

  const neighborhoods = [...new Set(fields.map(field => field.neighborhood))];

  const filteredFields = useMemo(() => {
    return fields.filter(field => {
      const matchesQuery = !searchFilters.query || 
        field.name.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        field.neighborhood.toLowerCase().includes(searchFilters.query.toLowerCase());
      
      const matchesType = !searchFilters.type || field.type === searchFilters.type;
      const matchesNeighborhood = !searchFilters.neighborhood || field.neighborhood === searchFilters.neighborhood;
      const matchesPrice = field.hourlyRate >= searchFilters.minPrice && field.hourlyRate <= searchFilters.maxPrice;

      return matchesQuery && matchesType && matchesNeighborhood && matchesPrice;
    });
  }, [fields, searchFilters]);

  const clearFilters = () => {
    updateSearchFilters({
      query: '',
      type: '',
      neighborhood: '',
      date: '',
      minPrice: 0,
      maxPrice: 200
    });
  };

  const getFieldTypeLabel = (type: string) => {
    switch (type) {
      case 'fut11': return 'Futebol 11x11';
      case 'fut7': return 'Fut7';
      case 'futsal': return 'Futsal';
      default: return type;
    }
  };

  const getFieldTypeColor = (type: string) => {
    switch (type) {
      case 'fut11': return 'bg-yellow-100 text-yellow-800';
      case 'fut7': return 'bg-green-100 text-green-800';
      case 'futsal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Campos Disponíveis
          </h1>
          <p className="text-gray-600">
            Encontrados {filteredFields.length} campos
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
            {/* Type Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Campo
              </label>
              <select
                value={searchFilters.type}
                onChange={(e) => updateSearchFilters({ type: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Todos os tipos</option>
                <option value="fut11">⚽ Futebol 11x11</option>
                <option value="fut7">🏟️ Fut7</option>
                <option value="futsal">🏐 Futsal</option>
              </select>
            </div>

            {/* Neighborhood Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bairro
              </label>
              <select
                value={searchFilters.neighborhood}
                onChange={(e) => updateSearchFilters({ neighborhood: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Todos os bairros</option>
                {neighborhoods.map(neighborhood => (
                  <option key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data
              </label>
              <input
                type="date"
                value={searchFilters.date}
                onChange={(e) => updateSearchFilters({ date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Price Range */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço por hora
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={searchFilters.minPrice || ''}
                  onChange={(e) => updateSearchFilters({ minPrice: Number(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={searchFilters.maxPrice || ''}
                  onChange={(e) => updateSearchFilters({ maxPrice: Number(e.target.value) || 200 })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Limpar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFields.map((field) => (
            <div key={field.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={field.images[0]}
                  alt={field.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getFieldTypeColor(field.type)}`}>
                    {getFieldTypeLabel(field.type)}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{field.rating}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{field.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{field.neighborhood}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{field.operatingHours.start} - {field.operatingHours.end}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">Até {field.capacity} jogadores</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {field.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                    {field.amenities.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        +{field.amenities.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-green-600">
                    R$ {field.hourlyRate}/h
                  </div>
                  <button
                    onClick={() => onFieldSelect(field)}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFields.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏟️</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Nenhum campo encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros para encontrar campos disponíveis
            </p>
          </div>
        )}
      </div>
    </div>
  );
}