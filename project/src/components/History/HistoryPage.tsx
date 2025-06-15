import React, { useState } from 'react';
import { Calendar, Clock, MapPin, DollarSign, Filter, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function HistoryPage() {
  const { user, reservations } = useApp();
  const [sortBy, setSortBy] = useState<'date' | 'cost' | 'field'>('date');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Histórico de Reservas</h1>
          <p className="text-gray-600">Você precisa estar logado para ver seu histórico</p>
        </div>
      </div>
    );
  }

  const userReservations = reservations.filter(r => r.userId === user.id);

  const filteredReservations = userReservations.filter(reservation => {
    if (filterStatus === 'all') return true;
    return reservation.status === filterStatus;
  });

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'cost':
        return b.totalCost - a.totalCost;
      case 'field':
        return a.field.name.localeCompare(b.field.name);
      default:
        return 0;
    }
  });

  const totalSpent = userReservations.reduce((sum, r) => sum + r.totalCost, 0);
  const totalReservations = userReservations.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      case 'completed':
        return 'Concluída';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Histórico de Reservas
          </h1>
          <p className="text-gray-600">
            Visualize todas as suas reservas realizadas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">{totalReservations}</h3>
                <p className="text-gray-600">Total de Reservas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">R$ {totalSpent}</h3>
                <p className="text-gray-600">Total Gasto</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {userReservations.filter(r => r.status === 'completed').length}
                </h3>
                <p className="text-gray-600">Partidas Jogadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-700">Filtrar por:</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="confirmed">Confirmadas</option>
                <option value="completed">Concluídas</option>
                <option value="cancelled">Canceladas</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'cost' | 'field')}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="date">Ordenar por Data</option>
                <option value="cost">Ordenar por Valor</option>
                <option value="field">Ordenar por Campo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reservations List */}
        {sortedReservations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Nenhuma reserva encontrada
            </h3>
            <p className="text-gray-500">
              {filterStatus === 'all' 
                ? 'Você ainda não fez nenhuma reserva'
                : 'Nenhuma reserva corresponde aos filtros selecionados'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedReservations.map((reservation) => (
              <div key={reservation.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 h-48 md:h-auto">
                    <img
                      src={reservation.field.images[0]}
                      alt={reservation.field.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {reservation.field.name}
                        </h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                          {getStatusText(reservation.status)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          R$ {reservation.totalCost}
                        </div>
                        <div className="text-sm text-gray-500">
                          Reserva #{reservation.id.slice(-6)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-3 flex-shrink-0" />
                        <div>
                          <div className="font-medium">
                            {new Date(reservation.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-sm">
                            {new Date(reservation.date).toLocaleDateString('pt-BR', { weekday: 'long' })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                        <div>
                          <div className="font-medium">
                            {reservation.startTime} - {reservation.endTime}
                          </div>
                          <div className="text-sm">
                            {((new Date(`1970-01-01T${reservation.endTime}:00`).getTime() - 
                               new Date(`1970-01-01T${reservation.startTime}:00`).getTime()) / 
                              (1000 * 60 * 60))}h de duração
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{reservation.field.neighborhood}</div>
                          <div className="text-sm">
                            {reservation.field.type === 'fut7' ? 'Fut7' : 'Futsal'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <div className="w-5 h-5 mr-3 flex-shrink-0 text-green-500">📅</div>
                        <div>
                          <div className="font-medium">
                            {new Date(reservation.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-sm">Data da reserva</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}