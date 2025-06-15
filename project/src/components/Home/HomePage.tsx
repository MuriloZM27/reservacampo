import React from 'react';
import { Search, MapPin, Clock, Star, TrendingUp, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HomePageProps {
  onPageChange: (page: 'fields' | 'reservations' | 'history') => void;
}

export function HomePage({ onPageChange }: HomePageProps) {
  const { fields, searchFilters, updateSearchFilters } = useApp();

  const featuredFields = fields.slice(0, 3);

  const handleQuickSearch = (type: string) => {
    updateSearchFilters({ type });
    onPageChange('fields');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 via-blue-500 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Reserve seu campo
            <span className="block text-yellow-300">em Maringá</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Encontre e reserve campos de futebol públicos de forma rápida e fácil
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <button
              onClick={() => onPageChange('fields')}
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Reservar Agora
            </button>
            <button
              onClick={() => onPageChange('history')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              Ver Histórico
            </button>
          </div>
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Busca Rápida
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <button
              onClick={() => handleQuickSearch('fut11')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-8 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg"
            >
              <div className="text-4xl mb-4">⚽</div>
              <h3 className="text-2xl font-bold mb-2">Campos 11×11</h3>
              <p className="opacity-90">Futebol de campo tradicional</p>
            </button>
            
            <button
              onClick={() => handleQuickSearch('fut7')}
              className="bg-gradient-to-r from-green-400 to-green-500 text-white p-8 rounded-xl hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg"
            >
              <div className="text-4xl mb-4">🏟️</div>
              <h3 className="text-2xl font-bold mb-2">Futebol 7</h3>
              <p className="opacity-90">Campos society para 7 jogadores</p>
            </button>
            
            <button
              onClick={() => handleQuickSearch('futsal')}
              className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-8 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
            >
              <div className="text-4xl mb-4">🏐</div>
              <h3 className="text-2xl font-bold mb-2">Futsal</h3>
              <p className="opacity-90">Quadras cobertas públicas</p>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Fields */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Campos em Destaque
            </h2>
            <p className="text-gray-600 text-lg">
              Os campos mais populares e bem avaliados da cidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredFields.map((field) => (
              <div key={field.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={field.images[0]}
                    alt={field.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      field.type === 'fut11' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : field.type === 'fut7' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {field.type === 'fut11' ? 'Futebol 11x11' : field.type === 'fut7' ? 'Fut7' : 'Futsal'}
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
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{field.name}</h3>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{field.neighborhood}</span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-4">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{field.operatingHours.start} - {field.operatingHours.end}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-green-600">
                      R$ {field.hourlyRate}/h
                    </div>
                    <button
                      onClick={() => onPageChange('fields')}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{fields.length}+</h3>
              <p className="text-gray-600">Campos Disponíveis</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">500+</h3>
              <p className="text-gray-600">Reservas Realizadas</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">4.8</h3>
              <p className="text-gray-600">Avaliação Média</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}