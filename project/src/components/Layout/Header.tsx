import React, { useState } from 'react';
import { Search, User, MapPin, Menu, X, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  currentPage: 'home' | 'fields' | 'reservations' | 'history' | 'admin';
  onPageChange: (page: 'home' | 'fields' | 'reservations' | 'history' | 'admin') => void;
  onAuthClick: () => void;
}

export function Header({ currentPage, onPageChange, onAuthClick }: HeaderProps) {
  const { user, logout, searchFilters, updateSearchFilters } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as const, label: 'Início', icon: MapPin },
    { id: 'fields' as const, label: 'Campos', icon: Search },
    { id: 'reservations' as const, label: 'Minhas Reservas', icon: User },
    { id: 'history' as const, label: 'Histórico', icon: User },
  ];

  if (user?.isAdmin) {
    navItems.push({ id: 'admin' as const, label: 'Admin', icon: User });
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-2 rounded-lg font-bold text-xl">
              ZAGGO
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar campos por nome, bairro..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchFilters.query}
                onChange={(e) => updateSearchFilters({ query: e.target.value })}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block">{user.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </div>
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Entrar
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-green-50"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Buscar campos..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={searchFilters.query}
                  onChange={(e) => updateSearchFilters({ query: e.target.value })}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Mobile Navigation */}
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}