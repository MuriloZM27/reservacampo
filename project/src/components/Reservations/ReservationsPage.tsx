import React from 'react';
import { Calendar, Clock, MapPin, DollarSign, X, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ReservationsPage() {
  const { user, reservations, cancelReservation, isLoading } = useApp();

  const userReservations = reservations.filter(r => r.userId === user?.id);
  const activeReservations = userReservations.filter(r => r.status === 'confirmed');
  const pastReservations = userReservations.filter(r => r.status === 'completed');

  const handleCancelReservation = async (reservationId: string) => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      await cancelReservation(reservationId);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return null;
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Minhas Reservas</h1>
          <p className="text-gray-600">Você precisa estar logado para ver suas reservas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Minhas Reservas</h1>
          <p className="text-gray-600">
            Gerencie suas reservas ativas e visualize o histórico
          </p>
        </div>

        {/* Active Reservations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Reservas Ativas</h2>
          
          {activeReservations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Nenhuma reserva ativa
              </h3>
              <p className="text-gray-500">
                Você não tem reservas confirmadas no momento
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeReservations.map((reservation) => (
                <div key={reservation.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={reservation.field.images[0]}
                      alt={reservation.field.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      {getStatusIcon(reservation.status)}
                      <span className="ml-1">{getStatusText(reservation.status)}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      {reservation.field.name}
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span>{new Date(reservation.date).toLocaleDateString('pt-BR')}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span>{reservation.startTime} - {reservation.endTime}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span>{reservation.field.neighborhood}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="text-xl font-bold text-green-600">
                          R$ {reservation.totalCost}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      disabled={isLoading}
                      className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      {isLoading ? 'Cancelando...' : 'Cancelar Reserva'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Reservations */}
        {pastReservations.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reservas Anteriores</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastReservations.map((reservation) => (
                <div key={reservation.id} className="bg-white rounded-xl shadow-lg overflow-hidden opacity-75">
                  <div className="relative">
                    <img
                      src={reservation.field.images[0]}
                      alt={reservation.field.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      {getStatusIcon(reservation.status)}
                      <span className="ml-1">{getStatusText(reservation.status)}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2">
                      {reservation.field.name}
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(reservation.date).toLocaleDateString('pt-BR')}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{reservation.startTime} - {reservation.endTime}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span className="font-bold text-green-600">
                          R$ {reservation.totalCost}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}