import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Layout/Header';
import { HomePage } from './components/Home/HomePage';
import { FieldsPage } from './components/Fields/FieldsPage';
import { ReservationPage } from './components/Reservation/ReservationPage';
import { ReservationsPage } from './components/Reservations/ReservationsPage';
import { HistoryPage } from './components/History/HistoryPage';
import { AdminPage } from './components/Admin/AdminPage';
import { AuthModal } from './components/Auth/AuthModal';
import { Field } from './types';

type Page = 'home' | 'fields' | 'reservations' | 'history' | 'reservation' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handlePageChange = (page: Exclude<Page, 'reservation'>) => {
    setCurrentPage(page);
    setSelectedField(null);
  };

  const handleFieldSelect = (field: Field) => {
    setSelectedField(field);
    setCurrentPage('reservation');
  };

  const handleReservationComplete = () => {
    setCurrentPage('reservations');
    setSelectedField(null);
  };

  const handleBackToFields = () => {
    setCurrentPage('fields');
    setSelectedField(null);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={handlePageChange} />;
      case 'fields':
        return <FieldsPage onFieldSelect={handleFieldSelect} />;
      case 'reservation':
        return selectedField ? (
          <ReservationPage
            field={selectedField}
            onBack={handleBackToFields}
            onReservationComplete={handleReservationComplete}
          />
        ) : (
          <FieldsPage onFieldSelect={handleFieldSelect} />
        );
      case 'reservations':
        return <ReservationsPage />;
      case 'history':
        return <HistoryPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Header
          currentPage={currentPage === 'reservation' ? 'fields' : currentPage}
          onPageChange={handlePageChange}
          onAuthClick={() => setShowAuthModal(true)}
        />
        
        <main>
          {renderCurrentPage()}
        </main>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-2 rounded-lg font-bold text-xl mb-4 inline-block">
                  ZAGGO
                </div>
                <p className="text-gray-300">
                  A plataforma oficial para reserva de campos esportivos públicos de Maringá.
                  Desenvolvido para facilitar o acesso ao esporte na nossa cidade.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <button 
                      onClick={() => handlePageChange('fields')}
                      className="hover:text-green-400 transition-colors"
                    >
                      Encontrar Campos
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handlePageChange('reservations')}
                      className="hover:text-green-400 transition-colors"
                    >
                      Minhas Reservas
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handlePageChange('history')}
                      className="hover:text-green-400 transition-colors"
                    >
                      Histórico
                    </button>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Contato</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>📧 contato@zaggo.com.br</li>
                  <li>📞 (44) 3025-8000</li>
                  <li>📍 Prefeitura de Maringá</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-8 mt-8 text-center text-gray-300">
              <p>&copy; 2025 ZAGGO - Sistema de Reservas de Campos Esportivos. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;