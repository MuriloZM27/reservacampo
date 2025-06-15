import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Users, Star, Calendar, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Field } from '../../types';

interface ReservationPageProps {
  field: Field;
  onBack: () => void;
  onReservationComplete: () => void;
}

export function ReservationPage({ field, onBack, onReservationComplete }: ReservationPageProps) {
  const { user, makeReservation, isLoading } = useApp();
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalCost, setTotalCost] = useState(0);

  const calculateCost = (start: string, end: string) => {
    if (!start || !end) return 0;
    
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    const hours = endHour - startHour;
    
    if (hours <= 0) return 0;
    
    return hours * field.hourlyRate;
  };

  const handleTimeChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartTime(value);
      setTotalCost(calculateCost(value, endTime));
    } else {
      setEndTime(value);
      setTotalCost(calculateCost(startTime, value));
    }
  };

  const handleReservation = async () => {
    if (!user || !selectedDate || !startTime || !endTime) return;

    const success = await makeReservation({
      fieldId: field.id,
      userId: user.id,
      date: selectedDate,
      startTime,
      endTime,
      totalCost,
      status: 'confirmed'
    });

    if (success) {
      onReservationComplete();
    }
  };

  const isFormValid = selectedDate && startTime && endTime && totalCost > 0;

  // Generate time options
  const timeOptions = [];
  for (let hour = 6; hour <= 23; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-green-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar aos campos
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Reservar Campo
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Field Details */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={field.images[0]}
              alt={field.name}
              className="w-full h-64 object-cover"
            />
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{field.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  field.type === 'fut7' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {field.type === 'fut7' ? 'Fut7' : 'Futsal'}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{field.neighborhood}</div>
                    <div className="text-sm">{field.address}</div>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>Funcionamento: {field.operatingHours.start} - {field.operatingHours.end}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>Capacidade: {field.capacity} jogadores</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Star className="w-5 h-5 mr-3 flex-shrink-0 text-yellow-400 fill-current" />
                  <span>{field.rating} ({field.totalReviews} avaliações)</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-xl font-bold text-green-600">R$ {field.hourlyRate}/hora</span>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Comodidades</h3>
                <div className="flex flex-wrap gap-2">
                  {field.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Fazer Reserva
            </h3>

            {!user ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Você precisa estar logado para fazer uma reserva
                </p>
                <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
                  Fazer Login
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Data da Reserva
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horário de Início
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => handleTimeChange('start', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Selecione</option>
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horário de Término
                    </label>
                    <select
                      value={endTime}
                      onChange={(e) => handleTimeChange('end', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Selecione</option>
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Cost Summary */}
                {totalCost > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Resumo da Reserva</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Data:</span>
                        <span>{new Date(selectedDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Horário:</span>
                        <span>{startTime} - {endTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duração:</span>
                        <span>{calculateCost(startTime, endTime) / field.hourlyRate}h</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg text-green-600 border-t border-green-200 pt-2">
                        <span>Total:</span>
                        <span>R$ {totalCost}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleReservation}
                  disabled={!isFormValid || isLoading}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processando...' : 'Confirmar Reserva'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Ao confirmar, você concorda com os termos de uso da plataforma
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}